
function addValue(){
  axios.post('/createBookMark', {value:currentPage, text:$("input[name=txtValue]").val()})
    .then(function(response) {
      console.log(response);
      loadBookMark();
      $("input[name=txtValue]").val("");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function setUpBookMark(pageNo, text){
  $("#goBookMark").attr("onClick", "loadSelectedPage("+pageNo+"); closepopup('bookmarkModal')");
  $("#deleteBookMark").attr("onClick", "removeBookMark('"+text+"')");
}

function loadBookMark(){
  axios.get('/fetchBookMark')
    .then(function(response) {
      console.log(response);
      $('select[name=lstValue]').html("");
      $.each(response.data, (index, body)=>{
        var option = $('<option/>');
        option.attr({ 'value': body.value }).text(body.text);
        option.attr("onClick", "setUpBookMark("+body.value+",'"+body.text+"')");
        $('select[name=lstValue]').append($(option));
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}

function removeBookMark(text){
  axios.delete('/removeBookMark/'+text)
    .then(function(response) {
      console.log(response);
      $('select[name=lstValue]').html("");
      $.each(response.data, (index, body)=>{
        var option = $('<option/>');
        option.attr({ 'value': body.value }).text(body.text);
        option.attr("onClick", "setUpBookMark("+body.value+",'"+body.text+"')");
        $('select[name=lstValue]').append($(option));
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}
