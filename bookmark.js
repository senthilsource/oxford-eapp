const fs = require("fs");
const _=require("lodash");

var fetchBookMark = () =>{
    try{
        return JSON.parse(fs.readFileSync("bookmark-list.json"));
    }
    catch(e){
        return [];
    }
};

var saveBookMark = (bookMarkArr)=>{
    fs.writeFileSync("bookmark-list.json", JSON.stringify(bookMarkArr));
}

var addfn = (newbookmark)=>{
    var bookMarkArr = fetchBookMark();
    console.log(`Adding bookmark ${newbookmark}`);
    bookMarkArr.push(newbookmark);
    saveBookMark(bookMarkArr);
    return newbookmark;
};

var listfn = ()=>{
    return fetchBookMark();
};

var removefn = (text)=>{
    console.log(`Removing bookmark ${text}`);
    var bookMarkArr = fetchBookMark();
    var filteredBookMark = bookMarkArr.filter((bookMark)=> bookMark.text !== text);
    saveBookMark(filteredBookMark);
    return fetchBookMark();
};

module.exports = {
    $addfn: addfn,
    $listfn : listfn,
    $removefn : removefn
}
