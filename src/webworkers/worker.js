importScripts('../bowser.min.js');

var check =  (bowser.safari);
var run = '';
if (check) {
  importScripts('../formdata.min.js');
  run = ' running from Safari';
}

self.addEventListener('message', function(message) {

  let type = message.data.type;
  let id = message.data.id;

  switch (type) {
    case 'PING': {
      var form = new FormData ();
      form.append ('response', 'received');

      self.postMessage ( {
        type: 'PONG', id: id, payload: {message: 'PONG' + run}, undefined
      }, undefined);
    }
  }
}, false);
