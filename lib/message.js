var Defer = require('jquery-deferred').Deferred;

var requestHandler = require('./requestHandler');

module.exports = (function() {
  /**
   * MP handler
   * @class Message
   * @constructor
   * @param  {Taringa} taringa a Taringa instance
   */
  function Message(taringa) {
    this.taringa = taringa;
  }

  /**
   * Fetches a message given it's ID
   * @method get
   * @param  {Number} id
   * @return {Deferred}
   */
  Message.prototype.get = function(id, callback) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.get("http://www.taringa.net/mensajes/leer/" + id, function(err, resp, body) {
      var data;
      if (!err) {
        data = body.match(/<div class=\"clearfix\">\s+<h2 class=\"floatL\">(.*?)<\/h2>\s+<\/div>\s+<div id=\"print-mensaje\">\s+<div class=\"comment clearfix\">\s+<div class=\"comment-data\">\s+<a href=\".*?\" class=\"min-avatar\">\s+<img src=\".*?\" class=\"avatar-48\">\s+<\/a>\s+<\/div>\s+<div class=\"comment-text\">\s+<div class=\"comment-author clearfix\">\s+@<a class="hovercard" data-uid="\d+" href=".*?">(.*?)<\/a>\s+<span class="subtext">\s+<span ts="(\d+)" title=".*?".*?<\/span>\s+<\/span>\s+<div class="comment-content">([\s\S]+)<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<div id=\"print-conversation\">/);
        if (data !== null) {
          var mp = {
            "subject": data[1],
            "sender": data[2],
            "timestamp": data[3],
            "body": data[4].trim()
          };
          deferred.resolve(mp);
          self.taringa.log('Message::get message fetched: ' + id);
        } else {
          deferred.reject('not_message');
          return self.taringa.error(this, 'Messsage::get It is not a message');
        }
      } else {
        deferred.reject(err);
        return self.taringa.error('Messsage::get Request was not succesful');
      }
    });

    return deferred;
  };

  /**
   * Gets the last message
   * @method getLast
   * @param  {Function} callback
   */
  Message.prototype.getLast = function(callback) {
    var deferred = Defer(),
      self = this;
    this.taringa.request.get("http://www.taringa.net/mensajes/recibidos/pagina1", function(err, resp, body) {
      var data;
      if (!err) {
        data = body.match(/<div class=\"m-opciones .*?\">\s+<input id=\"(\d+)\" name=\"\d+\" type=\"checkbox\" class/);
        if (data !== null) {
          deferred.resolve(data[1]);
          self.taringa.log('Message::getLast fetched');
        } else {
          deferred.reject('not_message');
          self.taringa.error(this, 'Messsage::getLast It is not a message');
        }
      } else {
        deferred.reject(err);
        self.taringa.error(this, 'Messsage::getLast Request was not succesful');
      }
    });

    return deferred;
  };

  return Message;

})();