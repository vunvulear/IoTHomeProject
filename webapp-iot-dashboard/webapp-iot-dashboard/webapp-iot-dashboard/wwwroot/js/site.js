function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); 
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

window.setInterval(function () {

    var currentTemp = httpGet("api/SystemStatus/CurrentTemperature");
    var minTemp = httpGet("api/SystemStatus/MinimumTemperature");

    document.getElementById("currentTemperature").innerHTML = currentTemp;
    document.getElementById("minimumTemperature").innerHTML = minTemp;

    var heatingPumpAnimation = document.getElementById("heatingPumpAnimation");    
    if (currentTemp <= minTemp)
    {
        heatingPumpAnimation.style.display = "block";
    } else {
        heatingPumpAnimation.style.display = "none";
    }

}, 1000);