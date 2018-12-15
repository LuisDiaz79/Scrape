

$(document).on('click', '.btnmodal', function (event) {
  console.log($(this).attr("data-id"));

  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      $('.modal-title').text(data.title);
      $('.modal-price').text(' $ ' + data.price);
      $('#savenote').attr('data-id', data._id);
    })

})

$(document).on("click", "#savenote", function (req, res) {
  // Grab the id associated with the article from the submit button

  let thisId = $(this).attr('data-id');
  var note = {
    title: $('#article-note-title').val(),
    note: $('#message-note').val(),
    article : thisId
  }
console.log(note);
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {note : note}
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      $('#article-note-title').val('');
      $('#message-note').val(''),
      $('#savenote').attr('data-id', '');
      // Empty the notes section
      //$("#notes").empty();
    });

  // Run a POST request to change the note, using what's entered in the inputs


  // Also, remove the values entered in the input and textarea for note entry
  $('.modal-title').val("");
  $('.modal-price').val("");
});


// When you click the savenote button
$(document).on("click", ".addArticle", function () {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");
  console.log("THIS ID " + thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/api/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});