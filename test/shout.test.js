var should = require('should');


module.exports = function(instance) {
  describe('Shouts', function() {

    it('should get', function(done) {
      this.timeout(5000);

      instance.shout.get(68970580).done(function(success, shout) {
        shout.owner.id.should.be.equal(21271542);
        done();
      }).fail(function(err) {
        throw new Error(err);
      });

    });

    it('should like a shout ', function(done) {
      this.timeout(5000);

      instance.shout.like(68982830).done(function(success, message, response) {
        if (success) {
          done();
        } else {
          // The user may have liked the shout already
          console.error('You have already liked that shout? Response: ', message);
          done();
        }
      }).fail(function(err) {
        throw new Error(err);
      });
    });

    it('should unlike a shout ', function(done) {
      this.timeout(5000);

      instance.shout.unlike(68982830).done(function(success) {
        if (success) {
          done();
        } else {
          // The user MUST have liked the shout in the previous test
          throw new Error('There was an error disliking that shout');
        }
      }).fail(function(err) {
        throw new Error(err);
      });

    });

    it('should fav a shout ', function(done) {
      this.timeout(5000);

      instance.shout.fav(68982830).done(function(success, message, response) {
        if (success) {
          done();
        } else {
          // The user may have liked the shout already
          console.error('You have already liked that shout? Response: ', message);
          done();
        }
      }).fail(function(err) {
        throw new Error(err);
      });
    });

    it('should unfav a shout ', function(done) {
      this.timeout(5000);

      instance.shout.unfav(68982830).done(function(success) {
        if (success) {
          done();
        } else {
          // The user MUST have liked the shout in the previous test
          throw new Error('There was an error disliking that shout');
        }
      }).fail(function(err) {
        throw new Error(err);
      });

    });

  });
};