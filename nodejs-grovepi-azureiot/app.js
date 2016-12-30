var GrovePi = require('node-grovepi').GrovePi;
var GrovePiSensors = require('./GrovePiSensors');
var Config = require('./config.json');

var Commands = GrovePi.commands;
var Board = GrovePi.board;

var DeviceCommunication = require('./DeviceCommunication');

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
                collectSensorData(grovePiSensors, deviceCommunication);
            }
        }
    })

    board.init();
}, Config.deviceCommunicationConfig);

function collectSensorData(grovePiSensors, deviceCommunication) {
    var timeIntervalInMilisec = Config.sensorDataTimeSampleInSec * 1000;
    setInterval((GrovePiSensors, deviceCommunication) => {
        var sensorsData = grovePiSensors.getAllSensorsData();

        var dataToSend = JSON.stringify({
            deviceId: Config.deviceCommunicationConfig.deviceId,
            msgType: sensorData,
            sensorInf: {
                temp: sensorsData.temp,
                humidity: sensorsData.humidity,
                distance: sensorsData.distance,
                light: sensorsData.light
            }

        });
        deviceCommunication.sendMessage(dataToSend);
    }, timeIntervalInMilisec);
}