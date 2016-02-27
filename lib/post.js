var _ = require('lodash');

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
   * @param  {Function} callback
   */
  Post.prototype.getRandom = function(type, callback) {
    var self = this;
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
          return callback(err);
        return callback(null, JSON.parse(body));
      });
    });
  };

  /**
   * Add a comment into a post
   * @method addComment
   * @param  {String} comment
   * @param  {Number} postId
   * @param  {Number} postOwner
   */
  Post.prototype.addComment = function(comment, postId, postOwner) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/comments/add', {
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
            return self.taringa.log('Post::addComment -> ' + data.data);
          }
        } catch (_error) {
          error = _error;
          return self.taringa.log('Post::addComment -> Post comentado');
        }
      } else {
        return self.taringa.log('Post::addComment -> Request was not succesful');
      }
    });
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
   */
  Post.prototype.create = function(options) {
    var self = this;

    return this.taringa.request.post('http://www.taringa.net/ajax/post/add', {
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
            return self.taringa.log('Post::create -> Post creado');
          }
        } catch (_error) {
          error = _error;
          return self.taringa.log('Post::create -> Post creado');
        }
      } else {
        return self.taringa.log('Post::create -> Request was not succesful');
      }
    });
  };

  return Post;

})();