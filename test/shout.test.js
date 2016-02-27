var should = require('should');


module.exports = function(instance) {
  describe('Shouts', function() {

    it('should download and check ', function(done) {
      this.timeout(15000);

      instance.shout.get(68970580, function(err, shout) {
        err.should.not.be.ok;
        shout.owner.id.should.be.equal(21271542);
        done();
      });

    });

  });
};