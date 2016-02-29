var should = require('should');


module.exports = function(instance) {
  describe('Users', function() {

    it('should get top weekly users', function(done) {
      instance.user.topWeeklyUsers(12).done(function(success, data){
        success.should.be.true;
        data.data.should.be.an.instanceOf(Object).and.have.properties(['points', 'followers']);
        data.data.points.should.be.instanceof(Array).and.have.lengthOf(12);
        data.data.followers.should.be.instanceof(Array).and.have.lengthOf(12);

        done();
      }).fail(function(err) {
        throw new Error(err);
      });
    });

  });
};