var _ = require('lodash'),
  Defer = require('node-promise').defer;

module.exports = (function() {
  /**
   * Post handler
   * @class Post
   * @constructor
   * @param  {Taringa} taringa
   */
  function Post(taringa) {
    this.taringa = taringa;
  }

  /**
   * Fetch a random post given it's type
   * @method getRandom
   * @param  {String} type Either 'trending', 'recent' or 'populars'
   * @return {Deferred}
   */
  Post.prototype.getRandom = function(type, callback) {
    var deferred = Defer(),
      self = this;

    type = type || 'trending';

    if (!_.contains(['recent', 'populars', 'trending'], type)) {
      type = 'trending';
    }

    var url = type === 'trending' ? 'http://api.taringa.net/post/trending/view' : 'http://api.taringa.net/post/' + type + '/view/all';
    this.taringa.request(url, function(err, res, body) {
      var postsList = _.pluck(JSON.parse(body), 'id');
      var randomPost = postsList[Math.floor(Math.random() * postsList.length)];

      self.taringa.request('http://api.taringa.net/post/view/' + randomPost, function(err, res, body) {
        if (err)
          return deferred.reject(err);
        return deferred.resolve(JSON.parse(body));
      });
    });

    return deferred;
  };

  /**
   * Add a comment into a post
   * @method addComment
   * @param  {String} comment
   * @param  {Number} postId
   * @param  {Number} postOwner
   * @return {Deferred}
   */
  Post.prototype.addComment = function(comment, postId, postOwner) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/comments/add', {
      form: {
        key: self.taringa.user_key,
        comment: comment,
        objectId: postId,
        objectOwner: postOwner,
        objectType: 'post',
        show: 'true'
      }
    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        try {
          data = JSON.parse(body);
          if (data.status === 0) {
            deferred.resolve(data.data);
            return self.taringa.log('Post::addComment -> ' + data.data);
          }
        } catch (_error) {
          error = _error;
          deferred.resolve(deferred);
          return self.taringa.log('Post::addComment -> Post comentado');
        }
      } else {
        deferred.reject(error || response.statusCode);
        return self.taringa.error('Post::addComment -> Request was not succesful');
      }
    });

    return deferred;
  };

  /**
   * Creates a post
   * @method create
   * @param  {Object} options
   * @param  {String} options.title
   * @param  {String} options.body
   * @param  {Number} options.category (default 1)
   * @param  {String | Array} options.tags 
   * @param  {String} options.thumbnail Thumbnail URL
   * @param  {Boolean} options.ownsource (default true)
   * @return {Deferred}
   */
  Post.prototype.create = function(options) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.post('http://www.taringa.net/ajax/post/add', {
      form: {
        key: self.taringa.user_key,
        titulo: options.title || '',
        cuerpo: options.body || '',
        categoria: options.category || 1,
        tags: options.tags || '',
        image_1x1: options.image_1x1 || options.thumbnail || '',
        image_4x3: options.image_4x3 || options.thumbnail || '',
        "own-source": options.ownsource || true,
      }

    }, function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        try {
          data = JSON.parse(body);
          if (data.status === 0) {
            deferred.resolve(data);
            return self.taringa.log('Post::create -> Post creado');
          }
        } catch (_error) {
          error = _error;
          deferred.resolve();
          return self.taringa.log('Post::create -> Post creado');
        }
      } else {
        deferred.reject(error || response.statusCode);
        return self.taringa.error('Post::create -> Request was not succesful');
      }
    });

    return deferred;
  };

  return Post;

})();