var GrovePi = require('node-grovepi').GrovePi;
var GrovePiSensors = require('./GrovePiSensors');

var Commands = GrovePi.commands;
var Board = GrovePi.board;

var board = new Board({
    debug: true,
    onError: function(err) {
      console.log('!!!! Error occurred !!!!')
      console.log(err)
    },
    onInit: function(res) {
      if (res) {
        console.log('GrovePi Version :: ' + board.version())

        var grovePiSensors = new GrovePiSensors();
        while(true)
        {
          grovePiSensors.getAllSensorsData();
        }
      }
    }
  })

board.init();