var GrovePi = require('node-grovepi').GrovePi;

var DHTDigitalSensor = GrovePi.sensors.DHTDigital;
var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital;

var LightAnalogSensor = GrovePi.sensors.LightAnalog;
var AnalogSensor = GrovePi.sensors.base.Analog;

function GrovePiSensors(config, debug = true) {
  this.debug = debug;
  this.tempHumSensor = new DHTDigitalSensor(config.grovePiConfig.dhtDigitalSensorPin);
  this.ultrasonicSensor = new UltrasonicDigitalSensor(config.grovePiConfig.ultrasonicDigitalSensorPin);
  this.lightSensor = new LightAnalogSensor(config.grovePiConfig.lightAnalogSensorPin);
  this.soundSensor = new AnalogSensor(config.grovePiConfig.soundAnalogSensorPin);
}

GrovePiSensors.prototype.getSoundData = function () {
  var res = this.soundSensor.read();
  if (this.debug) {
    var text = 'Sound level: ' + res;
    console.log(text);
  }

  return {
    soundLevel: res
  };
}

GrovePiSensors.prototype.getTempAndHumData = function () {
  var res = this.tempHumSensor.read();
  var temp = res[0];
  var humidity = res[1];

  if (this.debug) {
    var text = 'T: ' + temp + ' H: ' + humidity;
    console.log(text);
  }

  return {
    temp: temp,
    humidity: humidity
  }
}

GrovePiSensors.prototype.getDistanceData = function () {
  var res = this.ultrasonicSensor.read();

  if (this.debug) {
    var text = 'Distance: ' + res;
    console.log(text);
  }

  return {
    distance: res
  }
}

GrovePiSensors.prototype.getLightData = function () {
  var res = this.lightSensor.read();

  if (this.debug) {
    var text = 'Light: ' + res;
    console.log(text);
  }

  return {
    light: res
  }
}

GrovePiSensors.prototype.getAllSensorsData = function () {
  if (this.debug) {
    console.log('Get Sensor Data started');
  }

  var currentTempAndHumData = this.getTempAndHumData();
  var distanceData = this.getDistanceData();
  var lightData = this.getLightData();
  var soundData = this.getSoundData();

  if (this.debug) {
    console.log('Get Sensor Data ended');
  }

  return {
    temp: currentTempAndHumData.temp,
    humidity: currentTempAndHumData.humidity,
    distance: distanceData.distance,
    light: lightData.light,
  }
};

module.exports = GrovePiSensors;