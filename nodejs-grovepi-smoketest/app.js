var GrovePi = require('node-grovepi').GrovePi;
var i2c = require('i2c-bus');

var Commands = GrovePi.commands;
var Board = GrovePi.board;

var DHTDigitalSensor = GrovePi.sensors.DHTDigital;

var DISPLAY_RGB_ADDR = 0x62;  
var DISPLAY_TEXT_ADDR = 0x3e;

function setRGB(i2c1, r, g, b) {  
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,0,0)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,1,0)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,0x08,0xaa)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,4,r)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,3,g)
  i2c1.writeByteSync(DISPLAY_RGB_ADDR,2,b)
}

function textCommand(i2c1, cmd) {  
  i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x80, cmd);
}

function setText(i2c1, text) {  
  textCommand(i2c1, 0x01) // clear display
  textCommand(i2c1, 0x08 | 0x04) // display on, no cursor
  textCommand(i2c1, 0x28) // 2 lines
  
  var count = 0;
  var row = 0;
  for(var i = 0, len = text.length; i < len; i++) {
    if(text[i] === '\n' || count === 16) {
      count = 0;
      row ++;
        if(row === 2)
          break;
      textCommand(i2c1, 0xc0)
      if(text[i] === '\n')
        continue;
    }
    count++;
    i2c1.writeByteSync(DISPLAY_TEXT_ADDR, 0x40, text[i].charCodeAt(0));
  }
}
 

var board = new Board({
    debug: true,
    onError: function(err) {
      console.log('!!!! Error occurred !!!!')
      console.log(err)
    },
    onInit: function(res) {
      if (res) {
        console.log('GrovePi Version :: ' + board.version())

        var i2c1 = i2c.openSync(1);    
        setRGB(i2c1, 135, 206, 250);
        

        var tempAndHumidity = new DHTDigitalSensor(4);
        tempAndHumidity.on('change', function(res){
          var temp= res[2];
          var humidity = res[1];
          var text = 'T: ' + temp + ' H: ' + humidity;
          console.log(text)
          setText(i2c1, text);
        })
        tempAndHumidity.watch();
		//i2c1.closeSync();
      }
    }
  })

board.init();
