var should = require('should');

var Taringa = require('../index');

if (!process.env.USER) {
  throw '\n\n\tEnv variable USER not found. Run: USER=user:pw npm test\n\n';
}
var login = process.env.USER.split(':');

var user = {
  name: login[0],
  pw: login[1]
};

describe('Login', function() {

  it('should log in correctly ', function(done) {
    this.timeout(50000);

    var instance = new Taringa(user.name, user.pw);
    instance.LOGGING.DISABLED = true;
    
    instance.on('logged', function() {

      instance.user_id.should.be.a.String();
      instance.user_key.should.be.a.String();

      done();

      // Call here the rest of the tests
      require('./post.test.js')(instance);
      require('./user.test.js')(instance);
      require('./shout.test.js')(instance);

    });

  });

});