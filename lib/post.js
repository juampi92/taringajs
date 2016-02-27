var _ = require('lodash');

module.exports = (function() {
  function Post(Taringa) {
    this.taringa = Taringa;
  }

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

  Post.prototype.create = function(title, body, category, tags, thumbnail) {
    var self;
    self = this;
    return this.taringa.request.post('http://www.taringa.net/ajax/post/add', {
      form: {
        key: self.taringa.user_key,
        titulo: title,
        cuerpo: body,
        categoria: category,
        tags: tags,
        image_1x1: thumbnail,
        image_4x3: thumbnail,
        "own-source": 1,
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