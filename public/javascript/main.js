function toggleNavLiEffect(){
  if($(window).width() < 768) {
    console.log("Toggle Navi");
    $('.navbar-nav.login-favs li').removeClass('hvr-grow');
  }else{
    $('.navbar-nav.login-favs li').addClass('hvr-grow');
  }
}

function toggleCenterDiv(){
  console.log("Toggle CenterDiv");
  if($(window).width() < 992) {
    $('.main-row').removeClass('synopsis-row');
  }else{
    $('.main-row').addClass('synopsis-row');
  }
}

$( document ).ready(function() {
  toggleNavLiEffect();
  toggleCenterDiv();

  function saveRecord(route, record){
      $.ajax({
          url: route,
          method: "POST",
          data: ''
          })
          .then(function(data) {
              console.log(data);
              if (data) {
              console.log("Favorite Movie Saved Sucessfully");
              console.log("data: " + data);
              } else {
              alert("Error Saving Favorite Movie");
              }
        });
  }

  $('.btn-favorite').click(function(){
    let url = window.location.pathname;
    let tokens = url.split("/");
    let movieId = tokens[2];
    let route = `/favorites/${movieId}`;

    console.log("movieId: " + movieId);
    console.log("route: " +  route);
    $('.btn-favorite span').text("Added to Favorites");
    $('.btn-favorite i.fa').css("color","red");
    saveRecord(route);
  });


});

$(window).resize(function(){
    toggleNavLiEffect();
    toggleCenterDiv();
    console.log($(window).width());
});
