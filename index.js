var request = require('request'),
  util = require('util'),
  EventEmitter = require('events').EventEmitter,
  _ = require('lodash');

module.exports = (function() {

  /**
   * Taringa user API
   * @class Taringa
   * @extends {EventEmitter}
   * @constructor
   * @param  {String} username
   * @param  {String} password
   */
  function Taringa(username, password) {
    EventEmitter.apply(this);

    if ((username !== null) && (password !== null)) {
      this.username = username;
      this.password = password;
      this.user_id = '';
      this.user_key = '';
      this.realtime_data = null;
      /**
       * @attribute request
       * @type {request}
       */
      this.request = request.defaults({
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:31.0) Gecko/20100101 Firefox/31.0'
        },
        jar: request.jar()
      });
      /**
       * @attribute shout
       * @type {Shout}
       */
      this.register('shout');
      /**
       * @attribute user
       * @type {User}
       */
      this.register('user');
      /**
       * @attribute kn3
       * @type {Kn3}
       */
      this.register('kn3');
      /**
       * @attribute message
       * @type {Message}
       */
      this.register('message');
      /**
       * @attribute post
       * @type {Post}
       */
      this.register('post');
      /**
       * @attribute notification
       * @type {Notification}
       */
      this.register('notification');

      this.login();
    } else {
      throw new Error("Not enough parameters provided. I need a username, a password");
    }
  }

  util.inherits(Taringa, EventEmitter);

  /**
   * Console logs messages
   * @method log
   * @param  {String} msg
   * @chainable
   */
  Taringa.prototype.log = function(msg) {
    console.log(msg);
    return this;
  };

  /**
   * Login
   *   Emits: 'logged'
   * @method login
   */
  Taringa.prototype.login = function() {
    var self = this,
      fields = {
        form: {
          nick: this.username,
          pass: this.password,
          redirect: '/',
          connect: ''
        }
      };

    return this.request.post('http://www.taringa.net/registro/login-submit.php', fields, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        if (data.status === 0) {
          throw new Error("Login failed: Request was not succesful");
        } else {
          return self.store_user_data();
        }
      } else {
        throw new Error("Login failed: Request was not succesful");
      }
    });
  };

  Taringa.prototype.register = function(libName) {
    var Lib = require('./lib/' + libName);
    this[libName] = new Lib(this);
    return this[libName];
  };

  /**
   * Emits: 'logged'
   * @method store_user_data
   * @private
   */
  Taringa.prototype.store_user_data = function() {
    var self = this;

    return this.request('http://www.taringa.net/', function(error, response, body) {
      var match, pattern;
      if (!error && response.statusCode === 200) {
        pattern = /var global_data = { user: \'(.*)\', user_key: \'(.*)\', postid/;
        match = pattern.exec(body);
        if ((match !== null) && match.length === 3 && match[1] !== '' && match[2] !== '') {
          self.user_id = match[1];
          self.user_key = match[2];
          pattern = /new Realtime\({\"host\":\"(.*?)\",\"port\":(\d+),\"useSSL\":true}(?:[^]+) notifications\('([a-z0-9]+)',/i;
          match = pattern.exec(body);
          if ((match !== null) && match.length === 4) {
            self.realtime_data = {
              "ip": match[1],
              "port": match[2],
              "hash": match[3]
            };
            return self.emit('logged');
          } else {
            throw new Error("Login failed: Request was not succesful- Realtime");
          }
        } else {
          throw new Error("Login failed: Request was not succesful- UserKey");
        }
      } else {
        throw new Error("Login failed: Request was not succesful");
      }
    });
  };

  return Taringa;

})();