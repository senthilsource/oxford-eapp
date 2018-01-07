//var axios = require("axios");
var url = "https://dry-falls-15164.herokuapp.com";

var loadSticky = "";
var removeSticky = "";
var hideSticky = "";
jQuery(document).ready(function($) {

  var stick = null;

  $('#booksection').on("dblclick", function(e) {
    if (openNotes) {
      options.notePosition = {
        top: e.clientY,
        left: e.clientX
      };
      stick = new $.CoaStickyNote($('#booksection'), options);
      stick.initialize(options);
    }
  });

  hideSticky = function() {
    options.notePosition = {
      top: "120px",
      left: "130px"
    };
    //stick = new $.CoaStickyNote($('#booksection'), options);
    stick.destroy();
  }

  var empty = function() {};
  var options = {
    resizable: true,
    availableThemes: [{
        text: "Yellow",
        value: "sticky-note-yellow-theme"
      },
      {
        text: "Green",
        value: "sticky-note-green-theme"
      },
      {
        text: "Blue",
        value: "sticky-note-blue-theme"
      },
      {
        text: "Pink",
        value: "sticky-note-pink-theme"
      },
      {
        text: "Orange",
        value: "sticky-note-orange-theme"
      }
    ],
    noteDimension: {
      width: "150px",
      height: "150px"
    },
    noteText: "",
    noteHeaderText: "Note",
    deleteLinkText: "X",
    startZIndex: 50,
    /*
     In all the below events, you can access note object. This note contains everything, regarding respective note.
     */
    // Use this event, if you want to perform some operation before creating a new note box.
    // Return false, if you want to abort the create new note request.
    beforeCreatingNoteBox: empty,

    // Use this event, if you want to perform some operation after creating a new note box.
    // Like save it on server/ local storage!
    onNoteBoxCreated: empty,

    // Use this event, if you want to perform some operation while updating note box header text.
    // Return false, if you want to abort the update note box header request!
    // You may also save the update header text on server/ local storage!
    onNoteBoxHeaderUpdate: empty,

    // Use this event, if you want to perform some operation while updating note box text.
    // Return false, if you want to abort the update note box text request!
    // You may also save the update note text on server/ local storage!
    onNoteBoxTextUpdate: empty,

    // Use this event, if you want to perform some operation while deleting note box.
    // Return false, if you want to abort the delete note request.
    // You may also delete note from server/ local storage!
    onNoteBoxDelete: empty,

    // Use this event, if you want to perform some operation after updating note box dimension.
    // You may also save the note dimension on server/ local storage!
    onNoteBoxResizeStop: empty,

    // Use this event, if you want to perform some operation after updating note box position.
    // You may also save the note position on server/ local storage!
    onNoteBoxDraggingStop: empty,

    // Use this event, if you want to perform some operation after updating note box z-index.
    // You may also save the note z-index on server/ local storage!
    onMovingNoteBoxOnTop: empty,

    // Use this event, if you want to perform some operation after updating note box theme.
    // You may also save the note theme on server/ local storage!
    onThemeSelectionChange: empty,
    beforeCreatingNoteBox: function(note) {
      console.log("beforeCreatingNoteBox");
    //  note.noteText = "Hello";
      return note;
    },
    onNoteBoxCreated: function(note) {
      console.log("onNoteBoxCreated" + currentPageNo);
      console.log(note);
      note.currentPageNo = currentPageNo;

      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onNoteBoxHeaderUpdate: function(note) {
      console.log("onNoteBoxHeaderUpdate");
      note.currentPageNo = currentPageNo;
      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onNoteBoxTextUpdate: function(note) {
      console.log("onNoteBoxTextUpdate" + currentPageNo);
      note.currentPageNo = currentPageNo;
      console.log(note);
      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onNoteBoxDelete: function(note) {
      console.log("onNoteBoxTextUpdate" + currentPageNo);
      note.currentPageNo = currentPageNo;
      console.log(note);
      axios.delete(url+`/deleteNote/${note.id}`)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });

    },
    onNoteBoxResizeStop: function(note) {
      console.log("onNoteBoxResizeStop");
      note.currentPageNo = currentPageNo;
      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onNoteBoxDraggingStop: function(note) {
      console.log("onNoteBoxDraggingStop");
      note.currentPageNo = currentPageNo;
      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onThemeSelectionChange: function(note) {
      console.log("onThemeSelectionChange");
      note.currentPageNo = currentPageNo;
      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    onMovingNoteBoxOnTop: function(note) {
      console.log("onMovingNoteBoxOnTop");
      note.currentPageNo = currentPageNo;
      axios.post(url+'/createNote', getBackEndStickyObject(note))
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  removeSticky = function() {
    //$(".each-sticky-note-outer").remove();
    $(".each-sticky-note-outer").attr("style", "display:none");
  };

  // Pass Page no as arguments and get only those stickys from json file and display it
  loadSticky = function(page) {
    $.ajax({
      url: url+`/getNotes/${page}`,
      method: "GET",
      dataType: "json",
    }).done(function(data) {

      $.each(data, function(index, value) {
        var note = new Object();
        note = getLocalStickyNoteObject(value, null);
        console.log(note);
        stick = new $.CoaStickyNote($('#booksection'), options);
        stick.loadExistingNote(note, options);
      });

    }).fail(function(err) {
      console.log(err);
    });
  };



  function getBackEndStickyObject(note) {
    return {
      Title: note.settings.noteHeaderText,
      NoteText: note.settings.noteText,
      PositionTop: note.settings.notePosition.top,
      PositionLeft: note.settings.notePosition.left,
      DimensionWidth: note.settings.noteDimension.width,
      DimensionHeight: note.settings.noteDimension.height,
      ZIndex: note.settings.zIndex,
      OuterCssClass: note.settings.defaultTheme.value,
      Id: note.id,
      Index: note.index,
      currentPageNo: note.currentPageNo
    };
  }

  function getLocalStickyNoteObject(backEndObj, note) {
    if (note == null) {
      note = {};
      note.settings = {};
      note.settings.notePosition = {};
      note.settings.defaultTheme = {};
      note.settings.noteDimension = {};
    }

    note.settings.noteHeaderText = backEndObj.Title;
    note.settings.noteText = backEndObj.NoteText;
    note.settings.notePosition.top = backEndObj.PositionTop;
    note.settings.notePosition.left = parseFloat(backEndObj.PositionLeft);
    if ((parseFloat(backEndObj.PositionLeft)) >= parseFloat(800)) {
      note.settings.notePosition.left -= 150;
    }
    note.settings.noteDimension.width = backEndObj.DimensionWidth;
    note.settings.noteDimension.height = backEndObj.DimensionHeight;
    note.settings.zIndex = backEndObj.ZIndex;
    note.settings.defaultTheme.value = backEndObj.OuterCssClass;
    note.id = backEndObj.Id;
    note.index = backEndObj.Index;
    note.currentPageNo = backEndObj.currentPageNo;
    return note;
  }


});
