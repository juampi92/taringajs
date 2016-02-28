var fs = require('fs'),
  Defer = require('node-promise').defer;

module.exports = (function() {
  /**
   * Kn3 methods
   * @class Kn3
   * @constructor
   * @param {Taringa} taringa a Taringa instance
   */
  function Kn3(taringa) {
    this.taringa = taringa;
  }

  /**
   * Uploads an image to Kn3
   * @method upload
   * @param  {String} file File path
   * @return {Deferred}
   */
  Kn3.prototype.upload = function(file) {
    var form, req,
      deferred = Defer(),
      self = this;

    req = this.taringa.request.post('http://kn3.net/upload.php', function(error, response, body) {
      var data;
      if (!error && response.statusCode === 200) {
        data = JSON.parse(body);
        fs.unlink(file);
        self.taringa.log('Kn3::upload Image uploaded');
        return deferred.resolve(data);
      } else {
        fs.unlink(file);
        self.taringa.error('Kn3::upload Request was not succesful');
        return deferred.reject(error);
      }
    });
    form = req.form();
    form.append('files[]', fs.createReadStream(file));
    return deferred;
  };

  /**
   * 
   * @method
   * @param  {String} url URL to import form
   * @return {Deferred}
   */
  Kn3.prototype["import"] = function(url) {
    var deferred = Defer(),
      self = this;

    this.taringa.request.head(url, function(err, res, body) {
      if (!err) {
        if (0 < res.headers['content-length'] && res.headers['content-length'] <= 2499334) {
          self.taringa.request(url).pipe(fs.createWriteStream("temporal.png")).on('close', function() {
            self.upload("temporal.png", deferred.resolve.bind(deferred));
          });
        } else {
          self.taringa.error('Kn3::import file too big');
          return deferred.reject('file_too_big');
        }
      } else {
        self.taringa.error('Kn3::import Request was not succesful');
        return deferred.reject(err);
      }
    });

    return deferred;
  };

  return Kn3;

})();