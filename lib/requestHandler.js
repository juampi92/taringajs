/**
 * @class RequestHandler
 */

/**
 * Fetches the content type of the response, like 'application/json'
 * @method getContentType
 * @param  {Object} response
 * @return {String}
 * @private
 */
var getContentType = function(response) {
  return response.headers['content-type'].split(';')[0];
};

module.exports = {
  /**
   * Middleware for DataBased requests. Data based meaning that the response is always 200, but the data.status is 0 when there's an error
   * @example
   *        this.taringa.resquest('http://taringa.net/api/something', requestHandler.DataBased(this.taringa, deferred, 'Something::get'));
   * @method DataBased
   * @param  {Taringa} taringaInstance The current taringa instance
   * @param  {Deferred} deferred
   * @param  {String} baseLogMessage Base message for logging, like 'Shout::add'
   * @return {Function} requestHandler
   */
  DataBased: function(taringaInstance, deferred, baseLogMessage) {

    return function(err, response, data) {
      if (err || response.statusCode !== 200) {
        taringaInstance.error(baseLogMessage + ' -> ' + err || ('error ' + response.statusCode));
        deferred.reject(err || response.statusCode);
        return;
      }

      var contentType = getContentType(response);

      if (contentType === 'application/json') {
        data = JSON.parse(data);
        taringaInstance.log(baseLogMessage + ' -> ' + data.data || 'success');
      }

      deferred.resolve(data.status === 1, data, response);
    };

  },
  /**
   * Middleware for RequestBased requests. Request based meaning that when there's any error, the response.statusCode is not 200
   * @example
   *        this.taringa.resquest('http://taringa.net/api/something', requestHandler.RequestBased(this.taringa, deferred, 'Something::get'));
   * @method RequestBased
   * @param  {Taringa} taringaInstance The current taringa instance
   * @param  {Deferred} deferred
   * @param  {String} baseLogMessage Base message for logging, like 'Shout::add'
   * @return {Function} requestHandler
   */
  RequestBased: function(taringaInstance, deferred, baseLogMessage) {

    return function(err, response, data) {
      if (err) {
        deferred.reject(err);
        taringaInstance.error(baseLogMessage + ' -> ' + err);
        return;
      }
      deferred.resolve(response.statusCode === 200, data, response);

      if (response.statusCode === 200) {
        return taringaInstance.log(baseLogMessage + ' -> ' + data || 'success');
      }

    };

  },
  /**
   * Middleware for TextBased requests. Request based meaning that when there's any error, the response.statusCode is not 200
   * @example
   *        this.taringa.resquest('http://taringa.net/api/something', requestHandler.TextBased(this.taringa, deferred, function parser(rawData) {
   *          return parsedData;
   *        }, 'Something::get'));
   * @method TextBased
   * @param  {Taringa} taringaInstance The current taringa instance
   * @param  {Deferred} deferred
   * @param  {Function} parserFunction
   * @param  {String} baseLogMessage Base message for logging, like 'Shout::add'
   * @return {Function} requestHandler
   */
  TextBased: function(taringaInstance, deferred, parserFunction, baseLogMessage) {

    return function(err, response, data) {
      if (err) {
        deferred.reject(err);
        taringaInstance.error(baseLogMessage + ' -> ' + err);
        return;
      }
      var parsedData = parserFunction ? parserFunction(data) || null : null;
      deferred.resolve(response.statusCode === 200 && !!parsedData, parsedData, response);

      if (response.statusCode === 200) {
        return taringaInstance.log(baseLogMessage + ' -> success');
      }

    };

  }
};