module.exports = (function() {
  /**
   * Notification handler
   * @class Notification
   * @constructor
   * @param  {Taringa} taringa A Taringa instance
   */
  function Notification(taringa) {
    this.taringa = taringa;
  }

  /**
   * Fetches the unred notifications
   * @method getUnread
   * @param  {Function} callback
   */
  Notification.prototype.getUnread = function(callback) {

    this.taringa.request.post('https://www.taringa.net/notificaciones-ajax.php', {
      form: {
        key: this.taringa.user_key,
        action: 'last',
        template: false,
        imageSize: 48
      }
    }, function(err, res, body) {
      if (err)
        return callback(err);

      var unreadNotifications = [];
      var notifications = JSON.parse(body);

      notifications.forEach(function(notification) {
        if (notification.event.statusView !== 'read') {
          unreadNotifications.push(notification);
        }
      });

      return callback(null, unreadNotifications);

    });
  };

  return Notification;

})();