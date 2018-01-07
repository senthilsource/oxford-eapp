var express = require("express");
var _ = require("lodash");
var fs = require("fs");
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var hl = require("highlight").Highlight;
var notes = require("./notes");
var bookmark = require("./bookmark");
var printpdf = require("./printpdf");
const pathCnst = require('path');
var path = pathCnst.join(__dirname + "/flipbook/pages/");
var log4js = require('log4js');
var annotator = require("./annotator");
const fileUpload = require('express-fileupload');
const cors = require("cors");


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adding cors
app.use(cors());

//To upload
app.use(fileUpload());

//To Upload Image
app.use(bodyParser.raw({ type: 'image/png' }));

var log = log4js.getLogger('server');

log4js.configure({
    appenders: { 'file': { type: 'file', filename: 'logs/server.log' }, 'console': { type: 'console' } },
    categories: { default: { appenders: ['file', 'console'], level: 'debug' } }
});

app.use("*", function (req, res, next) {
    log.info("Accessing >>", req._parsedUrl.pathname);
    next();
});

app.post('/upload', function (req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let uploadedFile = req.files.upload;

    // Use the mv() method to place the file somewhere on your server
    uploadedFile.mv('annotate-list.json', function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});

app.get('/download', function (req, res) {
    var file = __dirname + '/annotate-list.json';
    res.download(file);
});

// var imgPath = pathCnst.join(__dirname+"/flipbook/source/images/");
// fs.readdir(imgPath, function(err, files){
//     if(err){
//         log.info(err);
//     }else{
//       var fileNo=0;
//          files.filter(function(file) {
//                   return file.substr(-4) === '.jpg';
//               }).forEach(function(file) {
//                     log.info(imgPath.concat(file));
//                     var currentPageNo = parseInt(file.split("-")[1].substr(0,file.split("-")[1].indexOf(".")));
//                     var afterConversion = pathCnst.join(__dirname+"/flipbook/source/imagesTemp/")
//                                           .concat(file.split("-")[0].concat("-").concat(currentPageNo+2).concat(".jpg"));
//                     log.info(afterConversion);
//                     fs.rename(imgPath.concat(file), afterConversion, function(err) {
//                         if ( err ) log.info('ERROR: ' + err);
//                     });
//                 });
//             }
//
// });

server.listen(process.env.PORT || 3000, function () {
    log.info("Server running!!");
});

app.get("/search/*", (req, res) => {
    log.info(req.params[0]);
    var availFiles = [];
    var unavailFiles = [];
    var availFilesCnt = 0;
    var unavailFilesCnt = 0;
    fs.readdir(path, function (err, files) {
        if (err) {
            log.info(err);
        } else {
            files.filter(function (file) {
                return file.substr(-5) === '.html';
            }).forEach(function (file) {
                fs.readFile(path.concat(file), 'utf-8', function (err, contents) {
                    if (err) {
                        log.info(err);
                    } else {
                        if (contents.replace(/(<([^>]+)>)/ig, "").toLowerCase().indexOf(req.params[0].toLowerCase()) >= 0) {
                            var firstIndex = contents.replace(/(<([^>]+)>)/ig, "").toLowerCase().indexOf(req.params[0].toLowerCase());
                            var lastIndex = contents.replace(/(<([^>]+)>)/ig, "").toLowerCase().lastIndexOf(req.params[0].toLowerCase());
                            var subString = contents.substring(firstIndex, firstIndex + req.params[0].length + 30);
                            availFilesCnt++;
                            availFiles.push(file);
                        } else {
                            unavailFilesCnt++;
                            unavailFiles.push(file);
                        }
                    }
                });
            });

            setTimeout(function () {
                res.send(availFiles.join(", "));
            }, 2000);
        }

    });

});

function inspectFile(file, contents, textToSearch) {
    if (contents.indexOf(textToSearch) != -1) {
        log.info(file);
    }
}

app.delete('/deleteNote/*', (req, res) => {
    notes.$removefn(req.params[0]);
    res.send("");
});

app.post('/createNote', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var note = JSON.stringify(req.body);
    notes.$addfn(JSON.parse(note));
    res.send("");

});

app.post('/createBookMark', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var bookMark = JSON.stringify(req.body);
    bookmark.$addfn(JSON.parse(bookMark));
    res.send("");

});

app.get('/fetchBookMark', (req, res) => {
    res.send(bookmark.$listfn());
});

app.delete('/removeBookMark/*', (req, res) => {
    res.send(bookmark.$removefn(req.params[0]));
});

app.post('/annotations', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var annotations = JSON.stringify(req.body);
    var newNote = annotator.$addfn(JSON.parse(annotations));
    res.send(newNote);
});

app.put('/annotations/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.params.id);
    req.body.id = JSON.parse(req.params.id);
    var annotations = JSON.stringify(req.body);
    var updateNote = annotator.$updateFn(JSON.parse(annotations));
    res.send(updateNote);
});

app.delete('/annotations/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.params.id);
    var updateNote = annotator.$removefn(req.params.id);
    res.send(JSON.stringify({ 'status': 'success' }));
});

app.post("/saveImage", (req, res) => {
    var img = req.body.image;
    var imgName="paint-image"+req.body.pageNo+".png";
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    fs.writeFile(imgName, buf, function (err) {
        if (err)
            console.log(err);
        else
            console.log("The file was saved!");
    });
    addFiles(imgName);
    res.send(getFiles());
});

app.get("/getPaintFiles", (req, res) => {
    res.send(getFiles());
});

var addFiles = (fileName) => {
    var files = getFiles();  
    var index;
    console.log(files);
    if(files.length>0){
        files.forEach(element => {
            if(element==fileName){
               index = files.indexOf(fileName);
            }
        });  
        if (index > -1) {     
             files.splice(index, 1); 
        }        
    }      
    files.push(fileName);   
    console.log("Final Files to save >>>"+files); 
    fs.writeFileSync("paint-image-list.txt", files);
}

var getFiles = () => {
    try {      
        var files=fs.readFileSync("paint-image-list.txt", "utf8").split(",");
        return files;
    }
    catch (e) {
        return [];
    }
};

app.get("/findMaxId", (req, res) => {
    res.send(JSON.stringify(annotator.$getMaxAnnotateId()));
});

app.get('/search', (req, res) => {
    log.info(req.query.page);
    res.send(annotator.$getAnnotatefn(req.query.page));
});

app.get('/getNotes/*', (req, res) => {
    res.send(notes.$getNotesfn(req.params[0]));
});

app.post('/preparePdf', (req, res) => {
    log.info("Preparing file for print...");
    printpdf.$preparePrint(JSON.parse(JSON.stringify(req.body)), () => {
        res.send();
    });
});

app.get('/#', function (req, res) {
    log.info(req._parsedUrl.pathname);
    // res.sendFile(__dirname + "/flipbook/pages"+req._parsedUrl.pathname);
});

app.get('/', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/terms.html");
});

app.get('/oxford', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/oxford.html");
});

app.get('/index', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/index.html");
});

app.get('/*.wav', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/sounds/" + req._parsedUrl.pathname);
});

app.get('/*.mp4', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/sounds/" + req._parsedUrl.pathname);
});

app.get('/*.pdf', function (req, res) {
    log.info(req._parsedUrl.pathname);
    //  io.sockets.emit("did-finish-load");
    res.sendFile(__dirname + "/flipbook/pdf/print/print.pdf");
});

app.get('/*.png', function (req, res) {
    log.info(req._parsedUrl.pathname);
    if(_.includes(req._parsedUrl.pathname, "paint-image")){
        res.sendFile(__dirname + req._parsedUrl.pathname);
    }else{
    res.sendFile(__dirname + "/flipbook/source/" + req._parsedUrl.pathname);
    }
});

app.get('/*.jpg', function (req, res) {
    log.info(req._parsedUrl.pathname);
    if (_.includes(req._parsedUrl.pathname, "Springboard")) {
        res.sendFile(__dirname + "/flipbook/source/images" + req._parsedUrl.pathname);
    } else if (_.includes(req._parsedUrl.pathname, "print")) {
        res.sendFile(__dirname + "/flipbook/source/images/print/" + req._parsedUrl.pathname);
    } else {
        res.sendFile(__dirname + "/flipbook/source/" + req._parsedUrl.pathname);
    }
});

app.get('/*.css', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/" + req._parsedUrl.pathname);
});

app.get('/*.js', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/" + req._parsedUrl.pathname);
});
app.get('/*.woff*', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/fonts" + req._parsedUrl.pathname);
});
app.get('/*.tiff', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/fonts" + req._parsedUrl.pathname);
});
app.get('/*', function (req, res) {
    log.info(req._parsedUrl.pathname);
    res.sendFile(__dirname + "/flipbook/pages" + req._parsedUrl.pathname);
});
