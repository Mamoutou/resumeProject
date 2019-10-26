/*Mamoutou Sangare V00010526
  Allan Liu V00806981

navigation bar referenced from Lab 6. LINK: https://thimbleprojects.org/mfoucault/210830/

requestSeach from Lab 8. LINK: https://thimbleprojects.org/mfoucault/225192/

Canvas lecture slides. LINK: https://connex.csc.uvic.ca/access/content/group/bb9a8803-9024-4dc0-a098-aeff66c17a60/lect17_canvas.pdf


*/ 


/*document ready,getLoction come reference from Lab8 */
var accesss_token_forcast = "adde6232f94238b51cc3c4eecfbf4cdd"
var accesss_token_new = "ed5de596c031441d82d5114afe6afc56"
var latitude = 0;
var latitudeLongitude = undefined;
var longitude = 0; 
var weather ="https://api.darksky.net/forecast/adde6232f94238b51cc3c4eecfbf4cdd/" 
   
var NEWS_SOURCE =  "https://newsapi.org/v1/sources?language=en"
var NEWS_ENDPOINT = "https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=ed5de596c031441d82d5114afe6afc56"
var NEWS_BBC = "https://newsapi.org/v1/articles?source=bbc-news&sortBy=top&apiKey=ed5de596c031441d82d5114afe6afc56"
var NEWS_CNN = "https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=ed5de596c031441d82d5114afe6afc56"
var NEWS_CNBC ="https://newsapi.org/v1/articles?source=cnbc&sortBy=top&apiKey=ed5de596c031441d82d5114afe6afc56"
var NEWS_MTV ="https://newsapi.org/v1/articles?source=mtv-news&sortBy=top&apiKey=ed5de596c031441d82d5114afe6afc56"
var NEWS_SKY = "https://newsapi.org/v1/articles?source=sky-news&sortBy=top&apiKey=ed5de596c031441d82d5114afe6afc56" 
var coords = undefined; 

/*document ready reference from Lab8 */
$(document).ready(function() {
    navigator.geolocation.watchPosition(function(position) {
        coords = getCoords(position.coords.latitude, position.coords.longitude);
        requestSearch2(coords);
        console.log("coordinates:"+ coords);      
        $("#weather").click(function() {
             requestSearch2(coords); 
        });
        coords="";
    })
    requestSearch();
    $("#news").click(function() {
      requestSearch(); 
    });
  //load in the local storage 
  loadWeatherInfo() 
  
});

function getCoords (latitude,longitude) {
  return (latitude+ "," +longitude);
};

/* getloction reference from Lab 8 */ 
function getLocation() {

  if (navigator.geolocation) {
      navigator.geolocation.watchPosition(showPosition);
  } else { 
      console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  weather += position.latitude + "," + position.longitude;
}

//requestSearch function for the weather
function requestSearch2(position) {
  var requestSettings2 ={
    success: searchSuccess2,
    error:searchError2,
  } 
  weather+=position; 
  
  jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });   
  
  $.ajax (weather,requestSettings2);   
  
  //this refreshes the weather function every 5 minutes and updates it
  var request5Minute = function myFunction() {
    setInterval(function(){$.ajax (weather,requestSettings2);}, 1000*60*5);
  }
  request5Minute(); 
} 

 //requestSearch function for the news
function requestSearch() {
 
  var settings = {
    success: searchSuccess,
    error: searchError
  }
  
  jQuery.ajax(NEWS_SOURCE, settings)  
  jQuery.ajax(NEWS_ENDPOINT, settings)
  jQuery.ajax(NEWS_BBC, settings) 
  jQuery.ajax(NEWS_CNN, settings) 
  jQuery.ajax(NEWS_CNBC, settings) 
  jQuery.ajax(NEWS_SKY, settings) 
  jQuery.ajax(NEWS_MTV, settings)  
}

//On successful search, retrieve the data. Used Lab 8 as a guide.

function searchSuccess(data, textStatus, jqXHR) {
   console.log(data)
   var bbcDiv = $('<div id="bbcDiv"></div>')
   var cnnDiv = $('<div id="cnnDiv"></div>')
   var tnwDiv = $('<div id="tnwDiv"></div>')
   var cnbcDiv = $('<div id="cnbcDiv"></div>')
   var skyDiv = $('<div id="skyDiv"></div>')
   var mtvDiv = $('<div id="mtvDiv"></div>')
   var menuDiv = $('<div id="menuDiv"></div>')
  
   function newsAdd(arg1, arg2){
     arg2.empty()
     
     if(data.source === arg1) {
       data.articles.forEach(function(newsArticle){

         var imageDes= $('<div class="imageDescription"></div>') 
         var newURLtoImage = $("<img />" ,{
           'class': 'newImg',
           src: newsArticle.urlToImage
         }); 

         newURLtoImage.attr('id', 'image');

         var title = $("<a />", {
           'class': 'title',
           html: newsArticle.title,
           href:newsArticle.url  
         })
         var description = $("<span class=\"description\">" + newsArticle.description + "</span>") 

         imageDes.append(newURLtoImage);
         imageDes.append(description);
         arg2.append(imageDes); 
         arg2.append(title); 
         imageDes.click(function(){
           $(".description").toggle(1500);
         })
       })
     }
     menuDiv.append(arg2)

   }
  
  newsAdd("bbc-news", bbcDiv) 
  bbcDiv.hide(); 

  newsAdd("cnn", cnnDiv) 
  cnnDiv.hide();
  
  newsAdd("the-next-web", tnwDiv)
  tnwDiv.hide(); 
  
  
  newsAdd("mtv-news", mtvDiv)
  mtvDiv.hide(); 

  newsAdd("cnbc", cnbcDiv)
  cnbcDiv.hide(); 

  newsAdd("sky-news", skyDiv)
  skyDiv.hide(); 

  
  $("#bbc").click(function(){   
     cnnDiv.hide(); 
     tnwDiv.hide(); 
     skyDiv.hide(); 
     cnbcDiv.hide(); 
     mtvDiv.hide(); 
     bbcDiv.show() 
  })
  
  $("#cnn").click(function(){ 
    bbcDiv.hide(); 
    tnwDiv.hide();
    skyDiv.hide(); 
    cnbcDiv.hide(); 
    mtvDiv.hide(); 
    cnnDiv.show()
  })
  
  $("#tnw").click(function(){
    bbcDiv.hide(); 
    cnnDiv.hide();
    skyDiv.hide(); 
    cnbcDiv.hide(); 
    mtvDiv.hide(); 
    tnwDiv.show(); 
  })
  
  $("#mtv").click(function(){
    bbcDiv.hide(); 
    cnnDiv.hide(); 
    skyDiv.hide();
    cnbcDiv.hide(); 
    tnwDiv.hide(); 
    mtvDiv.show(); 
  })
  $("#cnbc").click(function(){
    bbcDiv.hide(); 
    cnnDiv.hide();
    skyDiv.hide();
    mtvDiv.hide(); 
    tnwDiv.hide(); 
    cnbcDiv.show(); 
  })
  
  $("#sky").click(function(){
    bbcDiv.hide(); 
    cnnDiv.hide(); 
    mtvDiv.hide(); 
    tnwDiv.hide(); 
    cnbcDiv.hide(); 
    skyDiv.show(); 
  }) 
 
  $("#content").append(menuDiv)
}


function searchError(jqXHR, error, errorThrown) {
  console.log("no")
}

//On success, retrieve data for weather
 function searchSuccess2(data, textStatus, jqXHR) {

    $("#content2").empty(); 
    console.log(data)
    var weatherDiv = $('<div class="weatherDiv"></div>')
    var currentDiv = $('<div id="currentDiv"></div>')
    var dayDiv = $('<div id="dayDiv"></div>') 
    var hourDiv = $('<div id="hourDiv"></div>')
    var temperatureDiv = $('<div class="temperatureDiv"></div>')
    var humidityDiv = $('<div id="humidityDiv"></div>')
    var pressureDiv = $('<div id="pressureDiv"></div>')
    var iconDiv = $('<div id="iconDiv"></div>')
    var timestamp = data.currently.time; 
    var newTime = new Date(timestamp * 1000) 
   
    newTime+="";
   var day = newTime.slice(0,15)
   dayDiv.append(day)
   
   var hourMinute = newTime.slice(16,21);
   hourDiv.append(hourMinute)
   
   var temperature = ((data.currently.temperature-32) * 5/9) 
   var temp= temperature.toFixed(0) + String.fromCharCode(176) + "C"
   temperatureDiv.append(temp)
   
   
   var  icon = data.currently.icon
   if (icon === "cloudy") {
     var newIcon = $('<i class="fa fa-cloud" aria-hidden="true"></i>')
     iconDiv.append(newIcon)
     iconDiv.append('<br />')  
   }
   
   if (icon === "clear-day") {
     var newIcon = $('<i class="fa fa-sun-o" aria-hidden="true"></i>')
     iconDiv.append(newIcon)
     iconDiv.append('<br />')  
   }
   
   if (icon === "rain")  {
     var newIcon = $('<i class="fa fa-tint" aria-hidden="true"></i>')
     iconDiv.append(newIcon)
     iconDiv.append('<br />')  
   }
 
   iconDiv.append(icon) 
   var  humidity = data.currently.humidity * 100
   humidity =  humidity.toFixed(0) 
   var humidityPercent = "Humidity: " +  humidity + " %"
   humidityDiv.append(humidityPercent) 
   
   var  pressure = data.currently.pressure
   var pressureString = "Pressure: " +  pressure.toFixed() + " hPa"
   pressureDiv.append(pressureString) 
   currentDiv.append(dayDiv)
   currentDiv.append(hourDiv)
   currentDiv.append(temperatureDiv) 
   currentDiv.append(iconDiv)  
   currentDiv.append(humidityDiv) 
   currentDiv.append(pressureDiv)
   weatherDiv.append(currentDiv)
   $("#content2").append(weatherDiv)
   
   var containerDiv =  ('<div class="containerDays" id="containerDay"></div>')   
   var newT;
   var newStringTime;
   var timest;  
   
   var mondayData = data.daily.data[1]; 
   var mondayDiv = $('<div id="mondayDiv" class="daysData"></div>') 
   timest = mondayData.time; 
   newT = new Date(timest * 1000) 
   newStringTime = newT+""; 
   $("#Mon").text(newStringTime.slice(0,3)) 
   $("#Mon").click(function() {
      $(".daysData").empty(); 
      weatherFunction(mondayData,mondayDiv); 
      saveWeatherInfo() 
   });
   
   var tuesdayData = data.daily.data[2];  
   var tuesdayDiv = $('<div id="tuesdayDiv" class="daysData"></div>') 
   timest = tuesdayData.time; 
   newT = new Date(timest * 1000) 
   newStringTime = newT+""; 
   $("#Tues").text(newStringTime.slice(0,3))
   $("#Tues").click(function() { 
      $(".daysData").empty(); 
      weatherFunction(tuesdayData,tuesdayDiv);  
     saveWeatherInfo()
  }); 
   
  var wednesdayData = data.daily.data[3];  
  var wednesdayDiv = $('<div id="wednesdayDiv" class="daysData"></div>')  
  timest = wednesdayData.time; 
  newT = new Date(timest * 1000) 
  newStringTime = newT+""; 
  $("#Wes").text(newStringTime.slice(0,3))
  $("#Wes").click(function() {
     $(".daysData").empty(); 
     weatherFunction(wednesdayData,wednesdayDiv); 
     saveWeatherInfo() 
  }); 
   
  var thursdayData = data.daily.data[4];  
  var thursdayDiv = $('<div id="thursdayDiv" class="daysData"></div>')  
  timest = thursdayData.time; 
  newT = new Date(timest * 1000) 
  newStringTime = newT+""; 
  $("#Thur").text(newStringTime.slice(0,3))

   $("#Thur").click(function() {
     $(".daysData").empty(); 
     weatherFunction(thursdayData,thursdayDiv);   
     saveWeatherInfo() 
   });
   
   var fridayData = data.daily.data[5];  
   var fridayDiv = $('<div id="fridayDiv" class="daysData"></div>')
   timest = fridayData.time; 
   newT = new Date(timest * 1000) 
   newStringTime = newT+""; 
   $("#Frid").text(newStringTime.slice(0,3))
   $("#Frid").click(function() {
     $(".daysData").empty(); 
     weatherFunction(fridayData,fridayDiv);
     saveWeatherInfo()
   });

   var saturdayData = data.daily.data[6];  
   var saturdayDiv = $('<div id="saturdayDiv" class="daysData"></div>') 
   timest = saturdayData.time; 
   newT = new Date(timest * 1000) 
   newStringTime = newT+""; 
   $("#Sat").text(newStringTime.slice(0,3))
   $("#Sat").click(function() {
     $(".daysData").empty(); 
     weatherFunction(saturdayData,saturdayDiv); 
     saveWeatherInfo() 
   });

  var sundayData = data.daily.data[7];  
  var sundayDiv = $('<div id="sundayDiv" class="daysData"></div>') 
  timest = sundayData.time; 
  newT = new Date(timest * 1000) 
  newStringTime = newT+""; 
  $("#Sun").text(newStringTime.slice(0,3)) 
  $("#Sun").click(function() {
     $(".daysData").empty(); 
     weatherFunction(sundayData,sundayDiv);
     saveWeatherInfo()  
   });
     /*putting all days into a container to make an aside bar*/ 
   var containerDays = $('<div class="containerDays" id="containerWeatherDaysId"></div>') 
   /* output the weather info base on the number of day */ 
    showDays = function showNumberDays() {
    
       daysNumber = $("#dayOption").val(); 
        $(".daysData").empty();  
       if (daysNumber==1){
          weatherFunction(mondayData,mondayDiv);
          /*console.log("day:"+daysNumber); */  
      }
      else if (daysNumber==2) {
         weatherFunction(mondayData,mondayDiv);
         weatherFunction(tuesdayData,tuesdayDiv); 
      }
      else if (daysNumber==3) {
         weatherFunction(mondayData,mondayDiv); 
         weatherFunction(tuesdayData,tuesdayDiv);
         weatherFunction(wednesdayData,wednesdayDiv);
     }
     else if (daysNumber==4) {
         weatherFunction(mondayData,mondayDiv); 
         weatherFunction(tuesdayData,tuesdayDiv);
         weatherFunction(wednesdayData,wednesdayDiv);
         weatherFunction(thursdayData,thursdayDiv);
     }
     else if (daysNumber==5) {
         weatherFunction(mondayData,mondayDiv); 
         weatherFunction(tuesdayData,tuesdayDiv); 
         weatherFunction(wednesdayData,wednesdayDiv);
         weatherFunction(thursdayData,thursdayDiv);
         weatherFunction(fridayData,fridayDiv);
     }
     else if (daysNumber==6) {
         weatherFunction(mondayData,mondayDiv); 
         weatherFunction(tuesdayData,tuesdayDiv);
         weatherFunction(wednesdayData,wednesdayDiv);
         weatherFunction(thursdayData,thursdayDiv);
         weatherFunction(fridayData,fridayDiv);
         weatherFunction(saturdayData,saturdayDiv);
     }
     else if (daysNumber==7) {
         weatherFunction(mondayData,mondayDiv); 
         weatherFunction(tuesdayData,tuesdayDiv);
         weatherFunction(wednesdayData,wednesdayDiv);
         weatherFunction(thursdayData,thursdayDiv);
         weatherFunction(fridayData,fridayDiv);
         weatherFunction(saturdayData,saturdayDiv);  
         weatherFunction(sundayData,sundayDiv); 
     }
     else{
      /* $(".containerDays").empty();  */ 
     }
     saveWeatherInfo()  
   } 
   
   /*NOTIFICATIONS
   Used lecture 17 slides canvas. https://connex.csc.uvic.ca/access/content/group/bb9a8803-9024-4dc0-a098-aeff66c17a60/lect17_canvas.pdf
   */ 
   notifyMe()
   function notifyMe() {
     // Let's check if the browser supports notifications
      if (!("Notification" in window)) {
         alert("This browser does not support system notifications");
      }

     // Let's check whether notification permissions have already been granted
     else if (Notification.permission === "granted") {
       // If it's okay let's create a notification
       if (temperature < 25)
       {
         var notification = new Notification("The temperture is currently " + temp);
       }
       else if (icon === "rain") {
         var notification = new Notification("It is likely to rain today");
       }
     }

     // Otherwise, we need to ask the user for permission
     else if (Notification.permission !== 'denied') {
       Notification.requestPermission(function (permission) {
         // If the user accepts, let's create a notification
         if (permission === "granted") {
           if (temperature < 25)
           {
             var notification = new Notification("The temperture is currently " + temp);
           }
           else if (icon === "rain") {
             var notification = new Notification("It is likely to rain today");
           }
         }
       })
     }
   }
   
   
  // var currentDiv = $('<div id="currentDiv"></div>') 
   function weatherFunction(currently,currentDiv) {
     var timestamp = currently.time; 
     var newTime = new Date(timestamp * 1000) 

     newTime+="";
     var day = newTime.slice(0,15)
      
     var temperatureMin = ((currently.temperatureMin-32) * 5/9) 
     var nimTemp= "Min tempererature:"+ temperatureMin.toFixed(2)+ String.fromCharCode(176) + "C"; 
     
     var temperature = ((currently.temperatureMax-32) * 5/9) 
     var temp= "Max tempererature:"+ temperature.toFixed(2)+ String.fromCharCode(176) + "C"; 
  

     var  humidity = currently.humidity * 100
     var humidityPercent = "Humidity: " +  humidity + " %"
   
     var  pressure = currently.pressure
     var pressureString = "Pressure: " +  pressure + " hPa"
  
     var  icon = currently.icon
   
 
     currentDiv.append('<br />') 
     currentDiv.append(day)
     currentDiv.append('<br />') 
     currentDiv.append(nimTemp)
     currentDiv.append('<br />')  
     currentDiv.append(temp) 
     currentDiv.append('<br />') 
     currentDiv.append(humidityPercent) 
     currentDiv.append('<br />') 
     currentDiv.append(pressureString)
     currentDiv.append('<br />')  
     currentDiv.append(icon)
     currentDiv.append('<br />')  
     
     containerDays.append(currentDiv)
     $("#content2").append(containerDays)
     $("#reload").empty() 
   }
   
}
 
function searchError2(jqXHR, error, errorThrown) {
    console.log("no22")
    
}

/* save data in the local storage */ 
function saveWeatherInfo(){
  var info = [] 
 myDivObj = document.getElementById("containerWeatherDaysId")
  if ( myDivObj ) {
    info.push(myDivObj.innerHTML); 
    console.log(info)
  }else{
   alert ( "text not Found" );
  }
  localStorage.weatherInfo = JSON.stringify(info) 
}

/*containerWeatherDaysId*/ 
///retrieve data from the local storage 
function loadWeatherInfo() {
  
  var arr = [] 
  if(!localStorage.weatherInfo) return
  var info = JSON.parse(localStorage.weatherInfo)
  for ( var text of info) {      
    $("#reload").append(text)
//    $("#containerWeatherDaysId").append(text) 
  }  
}

