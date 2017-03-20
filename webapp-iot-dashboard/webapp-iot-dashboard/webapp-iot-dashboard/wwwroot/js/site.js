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
    var isHeatingSystemRunning = document.getElementById("isHeatingSystemRunning");
    if (currentTemp <= minTemp)
    {
        heatingPumpAnimation.style.display = "block";
        isHeatingSystemRunning.innerText = "ON";

    } else {
        heatingPumpAnimation.style.display = "none";
        isHeatingSystemRunning.innerText = "OFF";
    }
    
    var motionDetectorOn = httpGet("api/SystemStatus/MotionDetectorOn");
    var motionImgSrc = null;
    var alarmtStatus = null;
    if (motionDetectorOn === "true")
    {        
        motionImgSrc = "/images/house-alarm.jpg";
        alarmtStatus = "ACTIVE";
    } else {
        motionImgSrc = "/images/house-secure.png";   
        alarmtStatus = "ARMED";
    }
    var thiefAlarmImg = document.getElementById("thiefAlarm");
    thiefAlarmImg.src = motionImgSrc;

    var alarmStatusTxt = document.getElementById("thiefAlarmStatus");
    alarmStatusTxt.innerText = alarmtStatus;

    

}, 3000);