var _ = require('lodash'),
  Defer = require('jquery-deferred').Deferred;

var requestHandler = require('./requestHandler');

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
   * @return {Deferred}
   */
  Shout.prototype.add = function(msg, type, privacy, attachment) {
    var deferred = Defer(),
      self = this;

    if (type === null) {
      type = 0;
    }
    if (privacy === null) {
      privacy = 0;
    }
    if (attachment === null) {
      attachment = '';
    }

    this.taringa.request.post('http://www.taringa.net/ajax/shout/add', {
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
        data = JSON.parse(body);

        if (data.status === 1) {
          self.taringa.log('Shout::add -> Added!');
          return deferred.resolve(data.data);
        }

        self.taringa.error('Shout::add -> ' + data.data);
        return deferred.reject(data.data);
      } else {
        self.taringa.error('Shout::add -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Comment a shout
   * @method addComment
   * @param  {String} comment
   * @param  {Number} obj_id Shout ID
   * @param  {Number} obj_owner Owner ID
   * @param  {Number} obj_type Shout Type
   */
  Shout.prototype.addComment = function(comment, obj_id, obj_owner, obj_type) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/comments/add', {
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
        data = JSON.parse(body);

        if (data.status === 1) {
          self.taringa.log('Shout::addComment -> Shout commented: ' + obj_id);
          return deferred.resolve(data);
        }

        self.taringa.error('Shout::addComment -> ' + data.data);
        return deferred.reject(data.data);
      } else {
        self.taringa.error('Shout::addComment -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Reply a comment
   * @method addReplyComment
   * @param  {String} options.comment
   * @param  {Number} options.objectId Shout ID
   * @param  {Number} options.objectOwner Shout Owner
   * @param  {Number} options.objectType Shout Type
   * @param  {Number} options.parent Shout Parent ID
   * @param  {Number} options.parentOwner Shout Parent Owner
   * @param  {String} options.signature
   * @return {Deferred}
   */
  Shout.prototype.addReplyComment = function(options) {
    var deferred = Defer(),
      self = this;

    var form = _.extend({
      key: this.taringa.user_key,
      show: 'true'
    }, options);

    this.taringa.request.post('http://www.taringa.net/ajax/comments/add', {
      form: form
    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);

        if (data.status === 1) {
          self.taringa.log('Shout::addReplyComment -> Comment replied: ' + options.objectId);
          return deferred.resolve(data);
        }
        self.taringa.error('Shout::addReplyComment -> ' + data.data);
        return deferred.reject(data.data);

      } else {
        self.taringa.error('Shout::addReplyComment -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Like a shout
   * @method like
   * @param  {Number} id Shout ID
   * @param  {Boolean} unline (default = false)
   * @return {Deferred}
   */
  Shout.prototype.like = function(id, unlike) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/serv/shout/' + (unlike ? 'unlike' : 'like'), {
      form: {
        key: self.taringa.user_key,
        object_id: id
      }
    }, requestHandler.RequestBased(this.taringa, deferred, 'Shout::like'));

    return deferred;
  };

  /**
   * Unlike a shout
   *     Method shortcut
   * @method unlike
   * @param  {Number} id
   * @return {Deferred}
   */
  Shout.prototype.unlike = function(id) {
    return this.like(id, true);
  };

  /**
   * Fav a Shout
   * @method fav
   * @param  {Number} id
   * @param  {Number} owner
   * @return {Deferred}
   */
  Shout.prototype.fav = function(id, owner) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/shout/favorite-add', {
      form: {
        key: self.taringa.user_key,
        owner: owner,
        uuid: id
      }
    }, function(error, response, body) {
      var data, tmp;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);

        if (data.status === 1) {
          self.taringa.log('Shout::fav -> Added to favs: ' + id);
          return deferred.resolve(data.data);
        }

        self.taringa.error('Shout::fav -> ' + data.data);
        return deferred.reject(data.data);
      } else {
        self.taringa.error('Shout::fav -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Reshout
   * @method reshout
   * @param  {Number} id
   * @param  {Number} owner
   * @return {Deferred}
   */
  Shout.prototype.reshout = function(id, owner) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/shout/add', {
      form: {
        key: self.taringa.user_key,
        parent_id: id,
        parent_owner: owner
      }
    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);

        if (data.status === 1) {
          self.taringa.log('Shout::reshout -> Reshouted: ' + id);
          return deferred.resolve(data.data);
        }

        self.taringa.error('Shout::reshout -> ' + data.data);
        return deferred.reject(data.data);
      } else {
        self.taringa.error('Shout::reshout -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Attach link
   * @method attachLink
   * @param  {String} link
   * @return {Deferred}
   */
  Shout.prototype.attachLink = function(link) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/shout/attach', {
      form: {
        key: self.taringa.user_key,
        url: link
      }
    }, function(error, response, body) {
      var data, tmp;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);

        if (data.status === 1) {
          deferred.resolve(data.data);
          return callback.call(this, 'Shout::attachLink -> ' + data.data.id);
        }

        self.taringa.error('Shout::reshout -> ' + data.data);
        return deferred.reject(data.data);

      } else {
        self.taringa.error('Shout::attachLink -> Request was not succesful');
        return deferred.reject(error && response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Fetches a Shout
   * @method get
   * @param  {Number} shout_id
   * @return {Deferred}
   */
  Shout.prototype.get = function(shout_id, callback) {
    var deferred = Defer(),
      self = this;

    this.taringa.request('http://api.taringa.net/shout/view/' + shout_id, requestHandler.DataBased(this.taringa, deferred, 'Shout::get')
      /*function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        self.taringa.log('Shout::get -> Fetched succesfully');
        return deferred.resolve(data);
      } else {
        self.taringa.error('Shout::get -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    }*/
    );

    return deferred;
  };

  /**
   * Get comment replies
   * @method getCommentReplies
   * @param  {Number} comment_id
   * @param  {Number} obj_id
   * @param  {Number} obj_owner
   * @param  {Number} obj_type
   * @return {Deferred}
   */
  Shout.prototype.getCommentReplies = function(comment_id, obj_id, obj_owner, obj_type, callback) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/comments/get-replies', {
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
        self.taringa.log('Shout::getCommentReplies -> Fetched succesfully');
        return deferred.resolve(data);
      } else {
        self.taringa.error('Shout::getCommentReplies -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * Get signature comment
   * @method getSignatureComment
   * @param  {Number} comment_id
   * @param  {Number} obj_id
   * @param  {Number} obj_type
   * @return {Deferred}
   */
  Shout.prototype.getSignatureComment = function(comment_id, obj_id, obj_type, callback) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/comments/get', {
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
          self.taringa.log('Shout::getSignatureComment -> Signature found');
          return deferred.resolve(match[1]);
        } else {
          self.taringa.error('Shout::getSignatureComment -> Signature not found');
          return deferred.reject('no_signature');
        }
      } else {
        self.taringa.error('Shout::getSignatureComment -> Request was not succesful');
        return deferred.reject(error || response.statusCode);
      }
    });

    return deferred;
  };

  /**
   * getRandom shout
   * @method getRandom
   * @return {Deferred}
   */
  Shout.prototype.getRandom = function(callback) {
    this.taringa.request('http://api.taringa.net/shout/random/view', function(err, response, body) {
      if (err || response.statusCode !== 200) {
        self.taringa.error('Shout::getRandom -> Request was not succesful');
        return deferred.reject(err || response.statusCode);
      }
      self.taringa.log('Shout::getRandom -> Fetched succesfully');
      return deferred.resolve(JSON.parse(body));
    });

    return deferred;
  };

  return Shout;

})();