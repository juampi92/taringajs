var _ = require('lodash');

module.exports = (function() {
  /**
   * Shout handler
   * @class Shout
   * @constructor
   * @param  {Taringa} taringa
   */
  function Shout(taringa) {
    this.taringa = taringa;
  }

  /**
   * Post a shout
   * @method add
   * @param  {String} msg
   * @param  {Number} type
   * @param  {Number} privacy
   * @param  {String} attachment
   */
  Shout.prototype.add = function(msg, type, privacy, attachment) {
    var self;
    if (type === null) {
      type = 0;
    }
    if (privacy === null) {
      privacy = 0;
    }
    if (attachment === null) {
      attachment = '';
    }
    self = this;

    return this.taringa.request.post('http://www.taringa.net/ajax/shout/add', {
      form: {
        key: self.taringa.user_key,
        attachment: attachment,
        attachment_type: type,
        privacy: privacy,
        body: msg
      }
    }, function(error, response, body) {
      var data, e;
      if (!error && response.statusCode === 200) {
        try {
          data = JSON.parse(body);
          if (data.status === 0) {
            return self.taringa.log('Shout::add -> ' + data.data);
          }
        } catch (_error) {
          e = _error;
          return self.taringa.log('Shout::add -> Shout realizado');
        }
      } else {
        return self.taringa.log('Shout::add -> Request was not succesful');
      }
    });
  };

  /**
   * Comment a shout
   * @method add_comment
   * @param  {String} comment
   * @param  {Number} obj_id Shout ID
   * @param  {Number} obj_owner Owner ID
   * @param  {Number} obj_type Shout Type
   */
  Shout.prototype.add_comment = function(comment, obj_id, obj_owner, obj_type) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/comments/add', {
      form: {
        key: self.taringa.user_key,
        comment: comment,
        objectId: obj_id,
        objectOwner: obj_owner,
        objectType: obj_type,
        show: 'true'
      }
    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        try {
          data = JSON.parse(body);
          if (data.status === 0) {
            return self.taringa.log('Shout::add_comment -> ' + data.data);
          }
        } catch (_error) {
          error = _error;
          return self.taringa.log('Shout::add_comment -> Shout comentado');
        }
      } else {
        return self.taringa.log('Shout::add_comment -> Request was not succesful');
      }
    });
  };

  /**
   * Reply a comment
   * @method add_reply_comment
   * @param  {String} object.comment
   * @param  {Number} object.objectId Shout ID
   * @param  {Number} object.objectOwner Shout Owner
   * @param  {Number} object.objectType Shout Type
   * @param  {Number} object.parent Shout Parent ID
   * @param  {Number} object.parentOwner Shout Parent Owner
   * @param  {String} object.signature
   */
  Shout.prototype.add_reply_comment = function(options) {
    var self = this;

    var form = _.extend({
      key: this.taringa.user_key,
      show: 'true'
    }, options);

    return this.taringa.request.post('http://www.taringa.net/ajax/comments/add', {
      form: form
    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        try {
          data = JSON.parse(body);
          if (data.status === 0) {
            return self.taringa.log('Shout::add_reply_comment -> ' + data.data);
          }
        } catch (_error) {
          error = _error;
          return self.taringa.log('Shout::add_reply_comment -> Respuesta a un comentario en un shout realizada');
        }
      } else {
        return self.taringa.log('Shout::add_reply_comment -> Request was not succesful');
      }
    });
  };

  /**
   * Like a shout
   * @method like
   * @param  {Number} id Shout ID
   * @param  {Number} owner Owner ID
   */
  Shout.prototype.like = function(id, owner) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/shout/vote', {
      form: {
        key: self.taringa.user_key,
        owner: owner,
        uuid: id,
        score: 1
      }
    }, function(error, response, body) {
      var data, tmp;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        if (data.status === 0) {
          return self.taringa.log('Shout::like -> ' + data.data);
        }
      } else {
        return self.taringa.log('Shout::like -> Request was not succesful');
      }
    });
  };

  /**
   * Fav a Shout
   * @method fav
   * @param  {Number} id
   * @param  {Number} owner
   */
  Shout.prototype.fav = function(id, owner) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/shout/favorite-add', {
      form: {
        key: self.taringa.user_key,
        owner: owner,
        uuid: id
      }
    }, function(error, response, body) {
      var data, tmp;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        if (data.status === 0) {
          return self.taringa.log('Shout::fav -> ' + data.data);
        }
      } else {
        return self.taringa.log('Shout::fav -> Request was not succesful');
      }
    });
  };

  /**
   * Reshout
   * @method reshout
   * @param  {Number} id
   * @param  {Number} owner
   */
  Shout.prototype.reshout = function(id, owner) {
    var self;
    self = this;

    return this.taringa.request.post('http://www.taringa.net/ajax/shout/add', {
      form: {
        key: self.taringa.user_key,
        parent_id: id,
        parent_owner: owner
      }
    }, function(error, response, body) {
      var data, e;
      if (!error && response.statusCode === 200) {
        try {
          data = JSON.parse(body);
          if (data.status === 0) {
            return self.taringa.log('Shout::reshout -> ' + data.data);
          }
        } catch (_error) {
          e = _error;
          return self.taringa.log('Shout::reshout -> Reshout realizado');
        }
      } else {
        return self.taringa.log('Shout::reshout -> Request was not succesful');
      }
    });
  };

  /**
   * Attach link
   * @method attach_link
   * @param  {String} link
   * @param  {Function} callback
   */
  Shout.prototype.attach_link = function(link, callback) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/shout/attach', {
      form: {
        key: self.taringa.user_key,
        url: link
      }
    }, function(error, response, body) {
      var data, tmp;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        if (data.status === 0) {
          return callback.call(this, 'Shout::attach_link -> ' + data.data);
        }
        return callback.call(this, false, data.data.id);

      } else {
        return callback.call(this, 'Shout::attach_link -> Request was not succesful');
      }
    });
  };

  /**
   * Fetches a Shout
   * @method get
   * @param  {Number} shout_id
   * @param  {Function} callback
   */
  Shout.prototype.get = function(shout_id, callback) {
    var self;
    self = this;
    return this.taringa.request('http://api.taringa.net/shout/view/' + shout_id, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        return callback.call(this, false, data);
      } else {
        return callback.call(this, 'Shout::get -> Request was not succesful');
      }
    });
  };

  /**
   * Get comment replies
   * @method getCommentReplies
   * @param  {Number} comment_id
   * @param  {Number} obj_id
   * @param  {Number} obj_owner
   * @param  {Number} obj_type
   * @param  {Function} callback
   */
  Shout.prototype.getCommentReplies = function(comment_id, obj_id, obj_owner, obj_type, callback) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/comments/get-replies', {
      form: {
        key: self.taringa.user_key,
        objectType: obj_type,
        objectId: obj_id,
        objectOwner: obj_owner,
        commentId: comment_id,
        page: '-200'
      }
    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        return callback.call(this, false, data);
      } else {
        return callback.call(this, 'Shout::getCommentReplies -> Request was not succesful');
      }
    });
  };

  /**
   * Get signature comment
   * @method getSignatureComment
   * @param  {Number} comment_id
   * @param  {Number} obj_id
   * @param  {Number} obj_type
   * @param  {Function} callback
   */
  Shout.prototype.getSignatureComment = function(comment_id, obj_id, obj_type, callback) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/comments/get', {
      form: {
        key: self.taringa.user_key,
        objectType: obj_type,
        objectId: obj_id,
        commentId: comment_id
      }
    }, function(error, response, body) {
      var match, pattern;
      if (!error && response.statusCode === 200) {
        pattern = /<div class=\"comment clearfix(?:.*?)\" data-id="(?:\d+)"(?:.*?)data-signature=\"(.*?)\"/;
        match = pattern.exec(body);
        if ((match !== null) && match.length > 0) {
          return callback.call(this, false, match[1]);
        } else {
          return callback.call(this, 'Shout::getSignatureComment -> Signature not found');
        }
      } else {
        return callback.call(this, 'Shout::getSignatureComment -> Request was not succesful');
      }
    });
  };

  /**
   * getRandom shout
   * @method getRandom
   * @param  {Function} callback
   */
  Shout.prototype.getRandom = function(callback) {
    return this.taringa.request('http://api.taringa.net/shout/random/view', function(err, response, body) {
      if (err)
        return callback.call(this, 'Shout::getRandom -> Request was not succesful', null);
      return callback.call(this, null, JSON.parse(body));
    });
  };

  return Shout;

})();