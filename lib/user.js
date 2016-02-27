module.exports = (function() {
  /**
   * User handler
   * @class User
   * @constructor
   * @param  {Taringa} taringa
   */
  function User(taringa) {
    this.taringa = taringa;
  }

  /**
   * Follow a user
   * @method follow
   * @param  {Number} user_id
   */
  User.prototype.follow = function(user_id) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/notificaciones-ajax.php', {
      form: {
        key: self.taringa.user_key,
        type: 'user',
        obj: user_id,
        action: 'follow'
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return self.taringa.log('User::follow -> Error al seguir al usuario');
      }
    });
  };

  /**
   * Unfollow an user
   * @method unfollow
   * @param  {Number} user_id
   */
  User.prototype.unfollow = function(user_id) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/notificaciones-ajax.php', {
      form: {
        key: self.taringa.user_key,
        type: 'user',
        obj: user_id,
        action: 'unfollow'
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        return self.taringa.log('User::follow -> Error al dejar de seguir al usuario');
      }
    });
  };

  /**
   * getUserFromNick
   * @method getUserIDFromNick
   * @param  {String} nick
   * @param  {Function} callback
   */
  User.prototype.getUserFromNick = function(nick, callback) {
    var self = this;

    return this.taringa.request('http://api.taringa.net/user/nick/view/' + nick, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        return callback.call(this, false, data);
      } else {
        return callback.call(this, 'User::getUserFromNick Request was not succesful');
      }
    });
  };

  /**
   * Get Followers
   * @method getFollowers
   * @param  {Number} user_id (use null to get logged user)
   * @param  {Number} page (default 1)
   * @param  {Function} callback
   */
  User.prototype.getFollowers = function(user_id, page, callback) {
    var userId = user_id || this.taringa.user_id,
      self = this;

    page = page || '1';

    return this.taringa.request('http://api.taringa.net/user/followers/view/' + userId + '?count=50&page=' + page,
      function(error, response, body) {
        var data;
        if (error || response.statusCode !== 200) {
          return self.taringa.log('User::getFollowers -> Error al obtener followers del usuario');
        } else {
          data = JSON.parse(body);
          return callback.call(this, false, data);
        }

      });
  };

  /**
   * Get Following
   * @method getFollowings
   * @param  {Number} user_id (use null to get logged user)
   * @param  {Number} page (default 1)
   * @param  {Function} callback
   */
  User.prototype.getFollowings = function(user_id, page, callback) {
    var userId = user_id || this.taringa.user_id;
    var self = this;
    page = page || '1';

    return this.taringa.request('http://api.taringa.net/user/followings/view/' + userId + '?count=50&page=' + page,
      function(error, response, body) {
        var data;
        if (error || response.statusCode !== 200) {
          return self.taringa.log('User::getListFollowings -> Error al obtener followings del usuario');
        } else {
          data = JSON.parse(body);
          return callback.call(this, false, data);
        }

      });
  };

  /**
   * Get user stats
   * @method getStats
   * @param  {Number} user_id (use null to get logged user)
   * @param  {Function} callback
   */
  User.prototype.getStats = function(user_id, callback) {
    var userId = user_id || this.taringa.user_id;
    return this.taringa.request('http://api.taringa.net/user/stats/view/' + userId,
      function(error, response, body) {
        var data;
        if (error || response.statusCode !== 200) {
          return self.taringa.log('User::getStats -> Error al obtener stats del usuario');
        } else {
          data = JSON.parse(body);
          return callback.call(this, false, data);
        }
      });
  };

  return User;

})();