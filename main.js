const {
  app,
  BrowserWindow
} = require('electron')
var fs = require("fs");
const server = require('./server.js');
const PDFWindow = require('electron-pdf-window')

const path = require('path')
const url = require('url')
var filePath = path.join(__dirname + '/flipbook/pdf/');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1200,
    webPreferences: {
      plugins: true
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //   // pathname: path.join(__dirname, 'index.html'),
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  mainWindow.loadURL("http://localhost:3000/");

  // Open the DevTools.
  //  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  mainWindow.on('view-pdf', (event, url) => {
    const pdfWindow = new BrowserWindow({
      width: 1024,
      height: 800,
      webPreferences: {
        plugins: true,
      },
    });
    pdfWindow.loadURL(url);
  });
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// app.on('ready', () => {
//   const win = new PDFWindow({
//     width: 800,
//     height: 600
//   })

// win.loadURL('http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
// });
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
