const fs = require("fs");
const path = require('path');
const merge = require('easy-pdf-merge');
var log4js = require('log4js');


var log = log4js.getLogger('printpdf');

log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'logs/server.log' } , 'console':{type:'console'}},
  categories: { default: { appenders: ['file', 'console'], level: 'debug' } }
});


var preparePrint = (pageNos, callback) => {

  log.info(pageNos.startPage + "," + pageNos.endPage);
  var printableFiles = [];
  var filePath = path.join(__dirname + '/flipbook/pdf/');
  fs.exists(path.join(__dirname + '/flipbook/pdf/print/print.pdf'), (exists) => {
    if (exists) {
      log.info("File exists and delinking now..");
      fs.unlinkSync(filePath.concat("/print/print.pdf"));
      log.info("Delinked");
    }
  });

  for (var i = pageNos.startPage; i <= pageNos.endPage; i++) {
    var pageNo = "";
    if (i < 10) {
      pageNo = "p0" + i + ".pdf";
    } else {
      pageNo = "p" + i + ".pdf";
    }
    printableFiles.push(filePath.concat(pageNo));
  }
  log.info(printableFiles);
  merge(printableFiles, filePath.concat("/print/print.pdf"), function(err) {
    if (err) {
      return log.debug(err);
    } else {
      log.info('Successfully merged pdf files for print...');
      callback();
    }
  });
}

module.exports = {
  $preparePrint: preparePrint
};
