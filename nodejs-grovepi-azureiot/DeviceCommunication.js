var AzureIoTHub = require('azure-iothub');
var Protocol = require('azure-iot-device-mqtt').Mqtt; // !!! This is new. Otherwise we don't have support for twin
var Device = require('azure-iot-device');
var Client = Device.Client;
var Message = Device.Message;

function DeviceCommunication(
  onInit,
  config,
  debug = true
) {
  this.debug = debug;
  this.registry = AzureIoTHub.Registry.fromConnectionString(config.azureIoTHubMasterConnectionString);
  this.deviceId = config.deviceId;
  this.azureIoTHubHostName = config.azureIoTHubHostName;

  this.onInit = onInit;

  this.createDevice();
}

// Register the given device or retrives the device key
// In a real scenario, this shall never be run on the same system
// The device key shall be provided from an external source
DeviceCommunication.prototype.createDevice = function () {
  var device = new AzureIoTHub.Device(null);
  device.deviceId = this.deviceId;

  this.registry.create(device, function (err, deviceInfo, res) {
    if (err) {
      this.registry.get(device.deviceId, this.updateDeviceInfo.bind(this));
    }
    if (deviceInfo) {
      this.updateDeviceInfo(err, deviceInfo)
    }
  }.bind(this));
}

DeviceCommunication.prototype.updateDeviceInfo = function (err, deviceInfo) {
  if (deviceInfo) {
    this.deviceInfo = deviceInfo;
    if (this.debug) {
      console.log('Device ID: ' + deviceInfo.deviceId);
      console.log('Device key: ' + deviceInfo.authentication.symmetricKey.primaryKey);
    }

    if (onInit) {
      onInit();
    }

  } else {
    throw err;
  }
}

DeviceCommunication.prototype.sendMessage = function (messageJson) {
  var message = new Message(messageJson);

  var client = this.getDeviceClient();
  client.sendEvent(message, printSendMessageStatus.bind(this));
}

DeviceCommunication.prototype.getDeviceClient = function () {
  var deviceConnectionString = this.getDeviceConnectionString();
  return Client.fromConnectionString(deviceConnectionString, Protocol);
}

DeviceCommunication.prototype.getDeviceConnectionString = function () {
  var deviceConnectionString = `HostName=${this.azureIoTHubHostName};DeviceId=${this.deviceInfo.deviceId};SharedAccessKey=${this.deviceInfo.authentication.SymmetricKey.primaryKey}`;
  return deviceConnectionString
}

function printSendMessageStatus(err, res) {
  if (err) {
    console.log(err.toString());
  }
  if (res && this.debug) {
    console.log('Message status ' + res.statusCode + ' ' + res.statusMessage);
  }
}

DeviceCommunication.prototype.listenToDeviceTwinUpdates = function (onAppConfigurationUpdate) {
  var client = this.getDeviceClient();
  var self = this;
  client.getTwin((err, twin) => {
    if (err) {
      console.log('could not get twin:' + err);
    } else {
      // At first run we read the desired values and persist them locally. 
      if (typeof twin.properties.desired.sensorDataTimeSampleInSec !== 'undefined' && twin.properties.desired.sensorDataTimeSampleInSec) {
        onAppConfigurationUpdate(twin.properties.desired.sensorDataTimeSampleInSec);
        deviceTwinReportUpdated(twin.properties.desired.sensorDataTimeSampleInSec, twin);
      } else {
        if (self.debug) {
          console.log('No sensor data time sample specified by the backend in device twin');
        }
      }

      // Rgister to device twin change
      twin.on('properties.desired', (desiredChange) => {
        if (self.debug) {
          console.log("Twin updated:" + JSON.stringify(desiredChange));
        }
        if (typeof desiredChange.sensorDataTimeSampleInSec !== 'undefined' && desiredChange.sensorDataTimeSampleInSec) {
          onAppConfigurationUpdate(desiredChange.sensorDataTimeSampleInSec);
          deviceTwinReportUpdated(twin.properties.desired.sensorDataTimeSampleInSec, twin);
        }
      });
    }
  });
}

function deviceTwinReportUpdated(sensorDataTimeSampleInSec, twin) {
  var patch = {
    sensorDataTimeSampleInSec: sensorDataTimeSampleInSec
  };
  twin.properties.reported.update(patch, function (err) {
    if (err && this.debug) {
      console.log('Error reporting properties: ' + err);
    } else {
      console.log('Device Twin report completed: ' + JSON.stringify(patch));
    }
  });
}

module.exports = DeviceCommunication;