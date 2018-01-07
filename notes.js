const fs = require("fs");
const _=require("lodash");

var fetchNote = () =>{
    try{
        return JSON.parse(fs.readFileSync("note-list.json"));
    }
    catch(e){
        return [];
    }
};


var saveNote = (noteArr)=>{
    fs.writeFileSync("note-list.json", JSON.stringify(noteArr));
}

var addfn = (newnote)=>{
    var noteArr = fetchNote();
    if(readfn(newnote.Id)!=undefined){
        return updateFn(newnote);
    }else{
      console.log(`Adding note ${newnote.Id}`);
      noteArr.push(newnote);
      saveNote(noteArr);
      return newnote;
    }
};

var updateFn = (newnote)=>{
    console.log(`updating note ${newnote.Id}`);
    removefn(newnote.Id);
    var noteArr = fetchNote();
    noteArr.push(newnote);
    saveNote(noteArr);
    return newnote;
};


var listfn = ()=>{
    return fetchNote();
};

var getNotesfn = (pageNo)=>{
    var notes =  fetchNote();
    var filteredNotes = notes.filter((note)=>{
      console.log(note.currentPageNo);
      console.log(_.isArray(note.currentPageNo));
      if(_.includes(note.currentPageNo, parseInt(pageNo))){
      //if(parseInt(pageNo) in note.currentPageNo){
        return note;
      }
    });
    return filteredNotes;
};

var readfn = (id)=>{
    console.log(`reading note ${id}`);
    var notes = fetchNote();
    return notes.filter((note)=> note.Id === parseInt(id))[0];
};

var removefn = (id)=>{
    console.log(`Removing notes ${id}`);
    var notes = fetchNote();
    var filteredNotes = notes.filter((note)=> note.Id !== parseInt(id));
  //  console.log(filteredNotes);
    saveNote(filteredNotes);
    return notes.length!=filteredNotes.length;

};

var logNote = (Note)=>{
    console.log(Note);
}

module.exports = {
    $addfn: addfn,
    $listfn : listfn,
    $readfn : readfn,
    $removefn : removefn,
    $logNote: logNote,
    $getNotesfn: getNotesfn
}
