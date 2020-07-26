const app = require('../index');

const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);

describe('Server / ', () => {
  it('Api welcome /api/', (done) => {
    chai
      .request(app)
      .get('/api/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('welcome');
        done();
      });
  });
});
