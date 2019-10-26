//Put your yelp access token here
var ACCESS_TOKEN=  "5YqBv7ytb_RPzzTSSojaVwgCYykRFo2ND41Pfg2QkpoMhXCU50wckv9XEdu-mQlwF-skh0RLPPVq0mgaTCLsyT3qnsGEeFkpqBpiYHAMgjYYsdBg8l1GNhRMYRC_WHYx" 
var YELP_ENDPOINT = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3"
var SEARCH_ENDPOINT = YELP_ENDPOINT + "/businesses/search"

$(document).ready(function() {
  var coords = undefined
  // disable the search button and add a message until we get some GPS coordinates
  $("#search-button").attr('disabled', true)
  $("#error-message").append('Waiting for GPS coordinates...')

  // check if the browser supports geolocation
  if(navigator.geolocation !== undefined) {
    // if it does, watch for the changes in the GPS information
    navigator.geolocation.watchPosition(function(position) {
      // put the coordinates in the coords variable (defined line 10)
      coords = position.coords
      // re-enable the search button, and remove the error message
      $("#search-button").attr('disabled', false)
      $("#error-message").empty()
    })
  }

  $("#search-button").click(function() {
    // get the search term and the coordinates, and call requestSearch()
   requestSearch($("#search-term").val(), coords)
   
  })
})

/*
  This function retreives the search term that is entered in the input,
  and send an AJAX request to the YELP API
*/

function requestSearch(searchTerm, coordinates) {
  $('#search-results').empty();
  $("#error-message").empty();  
  var requestSettings ={
    success: searchSuccess,
    error:searchError,
    data: {
      term:searchTerm,
      latitude:coordinates.latitude,
      longitude: coordinates.longitude
    },
    headers:{
      Authorization: "Bearer " + ACCESS_TOKEN
    },
  }
  $.ajax (SEARCH_ENDPOINT,requestSettings);  
}


/*
  This function adds each business in the data to the search-results div
*/
function searchSuccess(data, textStatus, jqXHR) {
  //console.log(data);
  var businessDiv =   $('<div id="businessDiv"></div>');
  data.businesses.forEach(function(business){  
      var businessImage = $('<img class="businessImage" src="' + business.image_url + '" />')
      businessImage.attr('alt', 'No Picture Available');
  
      var addStar = $("<span />") 
      var image = $("<span/>", { html: business.image_url});
      var price = $("<span/>", { html: business.price });
      var name =  $("<span/>", { html: business.name });
      var rate =  $("<span/>", { html: business.rating });
     
    
      var rateNumber = Math.floor(business.rating) 
    
      for (var i=0; i< rateNumber; ++i){
        addStar.append($("<i class= \"fa fa-star\" aria-hidden=\"true\"> </i>"));
      }
     if (rateNumber < business.rating){
        addStar.append($("<i class= \"fa fa-star-half\" aria-hidden=\"true\"> </i>"));
     }  
    businessImage.appendTo(businessDiv); 
    name.appendTo(businessDiv);
    price.appendTo(businessDiv);
    addStar.appendTo(businessDiv); 
    
  //  businessDiv.appendTo($("#search-results"))
    
    var Div1 = $("<div id=\"Div1\"></div>");
    var Div2 = $("<div id=\"Div2\"></div>");
    var Div3 = $("<div id=\"Div3\"></div>");
    var Div4 = $("<div id=\"Div4\"></div>");
    
    Div1.append(businessImage);
    
    Div3.append(name); 
    Div1.append(Div3);   
    Div2.append(Div3)  
    Div4.append(price);
    Div4.append(addStar);
    Div2.append(Div4);   
    Div1.append(Div2);
    
    businessDiv.append(Div1) 
    })
  
    businessDiv.appendTo($("#search-results")) 
}
   
function searchError(jqXHR, error, errorThrown) {
    $("#error-message").empty(); 
    $("#error-message").append("No valid input")
}
