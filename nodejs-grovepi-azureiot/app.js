var GrovePi = require('node-grovepi').GrovePi;
var GrovePiSensors = require('./GrovePiSensors');

var Commands = GrovePi.commands;
var Board = GrovePi.board;

var DeviceCommunication = require('./DeviceCommunication');
var sensorDataTimeSampleInSec = 1;

var deviceCommunication = new DeviceCommunication(onInit = () => {
    var board = new Board({
        debug: true,
        onError: function (err) {
            console.log('!!!! Error occurred !!!!')
            console.log(err)
        },
        onInit: function (res) {
            if (res) {
                console.log('GrovePi Version :: ' + board.version())
                var grovePiSensors = new GrovePiSensors();
                collectSensorData(grovePiSensors,deviceCommunication);
            }
        }
    })

    board.init();
});

function collectSensorData(grovePiSensors, deviceCommunication) {
    var timeIntervalInMilisec = sensorDataTimeSampleInSec*1000;
    setInterval((GrovePiSensors, deviceCommunication) => {
            var sensorsData = grovePiSensors.getAllSensorsData();

            var dataToSend = JSON.stringify({
                deviceId: 'vunvulearaspberry',
                msgType: sensorData,
                sensorInf: {
                    temp: sensorsData.temp,
                    humidity: sensorsData.humidity,
                    distance: sensorsData.distance,
                    light: sensorsData.light
                }

            });
            deviceCommunication.sendMessage(dataToSend);
        },
        timeIntervalInMilisec);
}