const fs = require("fs");
const _ = require("lodash");

var fetchAnnotators = () => {
    try {
        return JSON.parse(fs.readFileSync("annotate-list.json"));
    }
    catch (e) {
        return [];
    }
};


var saveAnnotate = (annoArr) => {
    fs.writeFileSync("annotate-list.json", JSON.stringify(annoArr));
}

var addfn = (newannotate) => {
    var annotateArr = fetchAnnotators();
    if (readfn(newannotate.id) != undefined) {
        return updateFn(newannotate);
    } else {       
        newannotate.id=getMaxAnnotateId();
        console.log(`Adding Annotate ${newannotate.id}`);
        annotateArr.push(newannotate);
        saveAnnotate(annotateArr);
        return newannotate;
    }
};

var updateFn = (newannotate) => {
    console.log(`updating Annotate ${newannotate.id}`);
    removefn(newannotate.id);
    var annotateArr = fetchAnnotators();   
    annotateArr.push(newannotate);
    saveAnnotate(annotateArr);
    return newannotate;
};


var listfn = () => {
    return fetchAnnotators();
};

var getMaxAnnotateId = () =>{
    if(fetchAnnotators().length>0){      
        var Id = Math.max.apply(Math,fetchAnnotators().map(function(annotation){return annotation.id;}));
        Id=Id+1;
     return Id;
    }else return 1;
}

var getAnnotatefn = (pageNo) => {
    console.log(`Fetching annotations for the page ${pageNo}`);
    var annotates = fetchAnnotators();
    var filteredAnnotates = annotates.filter((annotate) => {
        console.log(annotate.pages);
        if (annotate.pages.includes(parseInt(pageNo))) {
            console.log(`Fetching annotations for the page ${pageNo}`);
            return annotate;
        }
    });
    return JSON.stringify({ 'total': filteredAnnotates.length, 'rows': filteredAnnotates });
};

var readfn = (id) => {
    console.log(`reading Annotate ${id}`);
    var annotates = fetchAnnotators();
    return annotates.filter((annotate) => annotate.id === parseInt(id))[0];
};

var removefn = (id)=>{
    console.log(`Removing annotation ${id}`);
    //console.log(_.isInteger(id));
    var annotates = fetchAnnotators();
    var filteredAnnotates = annotates.filter((annotate) => parseInt(annotate.id) != parseInt(id));   
    saveAnnotate(filteredAnnotates);
    return annotates.length!=filteredAnnotates.length;

};

module.exports = {
    $addfn: addfn,
    $listfn: listfn,
    $readfn: readfn,
    $removefn : removefn,
    $updateFn:updateFn,   
    $getAnnotatefn: getAnnotatefn,
    $getMaxAnnotateId: getMaxAnnotateId
}
