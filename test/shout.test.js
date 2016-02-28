var should = require('should');


module.exports = function(instance) {
  describe('Shouts', function() {

    it('should download and check ', function(done) {
      this.timeout(15000);

      instance.shout.get(68970580).then(function(success, shout) {
        shout.owner.id.should.be.equal(21271542);
        done();
      }, function(err) {
        throw new Error(err);
      });

    });

    it('should like a shout ', function(done) {
      this.timeout(15000);

      instance.shout.like(68982830).then(function(success, message, response) {
        if (success) {
          done();
        } else {
          // The user may have liked the shout already
          console.error('You have already liked that shout? Response: ', message);
          done();
        }
      }, function(err) {
        throw new Error(err);
      });
    });

    it('should unlike a shout ', function(done) {
      instance.shout.unlike(68982830).then(function(success) {
        if (success) {
          done();
        } else {
          // The user MUST have liked the shout in the previous test
          throw new Error('There was an error disliking that shout');
        }
      }, function(err) {
        throw new Error(err);
      });

    });

  });
};