var Defer = require('jquery-deferred').Deferred;

var requestHandler = require('./requestHandler');

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
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/notificaciones-ajax.php', {
      form: {
        key: self.taringa.user_key,
        type: 'user',
        obj: user_id,
        action: 'follow'
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        self.taringa.error('User::follow -> Error al seguir al usuario');
        return deferred.reject(error || response.statusCode);
      }
      self.taringa.log('User::follow -> Siguiendo al usuario ' + user_id);
      return deferred.resolve();
    });

    return deferred;
  };

  /**
   * Unfollow an user
   * @method unfollow
   * @param  {Number} user_id
   */
  User.prototype.unfollow = function(user_id) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/notificaciones-ajax.php', {
      form: {
        key: self.taringa.user_key,
        type: 'user',
        obj: user_id,
        action: 'unfollow'
      }
    }, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        self.taringa.error('User::follow -> Error al dejar de seguir al usuario');
        return deferred.reject(error || response.statusCode);
      }
      self.taringa.log('User::follow -> Dejando de seguir al usuario ' + user_id);
      return deferred.resolve();
    });

    return deferred;
  };

  /**
   * getUserFromNick
   * @method getUserIDFromNick
   * @param  {String} nick
   * @return {Deferred}
   */
  User.prototype.getUserFromNick = function(nick) {
    var deferred = Defer(),
      self = this;

    this.taringa.request('http://api.taringa.net/user/nick/view/' + nick, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        return deferred.resolve(data);
      } else {
        self.taringa.log(this, 'User::getUserFromNick Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Get Followers
   * @method getFollowers
   * @param  {Number} user_id (use null to get logged user)
   * @param  {Number} page (default 1)
   * @return {Deferred}
   */
  User.prototype.getFollowers = function(user_id, page) {
    var userId = user_id || this.taringa.user_id,
      deferred = Defer(),
      self = this;

    page = page || '1';

    this.taringa.request('http://api.taringa.net/user/followers/view/' + userId + '?count=50&page=' + page, function(error, response, body) {
      var data;
      if (error || response.statusCode !== 200) {
        self.taringa.error('User::getFollowers -> Error al obtener followers del usuario');
        return deferred.reject(error || response.statusCode);
      } else {
        data = JSON.parse(body);
        return deferred.resolve(data);
      }

    });

    return deferred;
  };

  /**
   * Get Following
   * @method getFollowings
   * @param  {Number} user_id (use null to get logged user)
   * @param  {Number} page (default 1)
   * @return {Deferred}
   */
  User.prototype.getFollowings = function(user_id, page) {
    var userId = user_id || this.taringa.user_id,
      deferred = Defer(),
      self = this;
    page = page || '1';

    this.taringa.request('http://api.taringa.net/user/followings/view/' + userId + '?count=50&page=' + page,
      function(error, response, body) {
        var data;
        if (error || response.statusCode !== 200) {
          self.taringa.error('User::getListFollowings -> Error al obtener followings del usuario');
          return deferred.reject(error || response.statusCode);
        } else {
          data = JSON.parse(body);
          return deferred.resolve(data);
        }

      });

    return deferred;
  };

  /**
   * Get user stats
   * @method getStats
   * @param  {Number} user_id (use null to get logged user)
   * @return {Deferred}
   */
  User.prototype.getStats = function(user_id) {
    var userId = user_id || this.taringa.user_id,
      deferred = Defer();

    this.taringa.request('http://api.taringa.net/user/stats/view/' + userId,
      function(error, response, body) {
        var data;
        if (error || response.statusCode !== 200) {
          self.taringa.error('User::getStats -> Error al obtener stats del usuario');
          return deferred.reject(error || response.statusCode);
        } else {
          data = JSON.parse(body);
          return deferred.resolve(data);
        }
      });

    return deferred;
  };

  return User;

})();