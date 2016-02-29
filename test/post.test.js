var should = require('should');


module.exports = function(instance) {
  describe('Posts', function() {

    it('should get top posts', function(done) {
      instance.post.topPosts(12).done(function(success, data) {
        success.should.be.true;
        data = data.data;

        data.should.be.an.instanceOf(Object).and.have.properties(['hoy', 'ayer', 'semana']);

        data.hoy.should.be.instanceof(Array).and.have.lengthOf(12);
        data.ayer.should.be.instanceof(Array).and.have.lengthOf(12);
        data.semana.should.be.instanceof(Array).and.have.lengthOf(12);

        data.hoy[0].should.be.instanceof(Object).and.have.properties(['title', 'url', 'thumb']);

        done();
      }).fail(function(err) {
        throw new Error(err);
      });
    });

  });
};