var GrovePi = require('node-grovepi').GrovePi;
var Jsonfile = require('jsonfile');

var GrovePiSensors = require('./GrovePiSensors');
var Config = require('./config.json');
var DeviceCommunication = require('./DeviceCommunication');

var Commands = GrovePi.commands;
var Board = GrovePi.board;

var collectSensorInterval;

var deviceCommunication = new DeviceCommunication(onInit = () => {
        deviceCommunication.listenToDeviceTwinUpdates((sensorDataTimeSampleInSec) => {
        // Update configuration 
        Config.sensorDataTimeSampleInSec = sensorDataTimeSampleInSec;

        // Update configuration file.
        Jsonfile.spaces = 4
        Jsonfile.writeFileSync('./config.json', Config);

        clearInterval(collectSensorInterval);
        var grovePiSensors = new GrovePiSensors(Config.grovePiConfig);
        collectSensorData(grovePiSensors, deviceCommunication);
    });
        var board = new Board({
            debug: true,
            onError: function (err) {
                console.log('!!!! Error occurred !!!!')
                console.log(err)
            },
            onInit: function (res) {
                if (res) {
                    console.log('GrovePi Version :: ' + board.version())
                    var grovePiSensors = new GrovePiSensors(Config.grovePiConfig);
                    collectSensorData(grovePiSensors, deviceCommunication);
                }
            }
        })

        board.init();
    }, Config.deviceCommunicationConfig);

function collectSensorData(grovePiSensors, deviceCommunication) {
    var timeIntervalInMilisec = Config.sensorDataTimeSampleInSec * 1000;
    collectSensorInterval = setInterval((grovePiSensors, deviceCommunication) => {
        var sensorsData = grovePiSensors.getAllSensorsData();

        var dataToSend = JSON.stringify({
            deviceId: Config.deviceCommunicationConfig.deviceId,
            msgType: "sensorData",
            sensorInf: {
                temp: sensorsData.temp,
                humidity: sensorsData.humidity,
                distance: sensorsData.distance,
                light: sensorsData.light
            }

        });
        deviceCommunication.sendMessage(dataToSend);
    }, timeIntervalInMilisec, grovePiSensors, deviceCommunication);
}