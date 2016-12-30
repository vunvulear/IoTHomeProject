var AzureIoTHub = require('azure-iothub');
var Protocol = require('azure-iot-device-amqp').Amqp;
var Device = require('azure-iot-device');
var Client = Device.Client;
var Message = Device.Message;
var Http = require('azure-iot-device-http').Http;


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

DeviceCommunication.prototype.getDeviceClient = function() {
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

module.exports = DeviceCommunication;