process.env.NODE_ENV = 'test';
const app = require('../index');
const mongoose = require('../config/mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);
console.log = function () {};
//models
const Doctor = require('../models/doctors');
const Patient = require('../models/patients');
const Report = require('../models/report');
// const { mongo } = require('mongoose');
// const { dropCollection } = require('../config/mongoose');
// const { describe } = require('mocha');

let token;
let patientID;
let reportStatus = [
  'Negative',
  'Travelled-Quarantine',
  'Symptoms-Quarantine',
  'Positive-Admit',
];
const doctorDetails = {
  username: 'testdoctor',
  password: 'test',
  name: 'Test Doctor',
};
const PatientDetails = {
  mob: 'testPatient',
  name: 'Test Patient',
};
const doctorLogin = {
  username: 'testdoctor',
  password: 'test',
};

// describe('Init', function() {

//     before(function (done) {
//         mongoose.connect('mongodb://localhost/db-test', function(){
//             mongoose.connection.db.dropDatabase(function(){
//                 done()
//             })
//         })
//     })

describe('Initialize', function () {
  describe('GET: /api/ ', () => {
    before((done) => {
      Doctor.deleteMany({}, (err) => {
        console.log('Successfully Deleted all contents in the DB');
        //   done();
      });
      Patient.deleteMany({}, (err) => {
        console.log('Successfully Deleted all contents in the DB');
        //   done();
      });
      Report.deleteMany({}, (err) => {
        console.log('Successfully Deleted all contents in the DB');
        //   done();
      });
      done();
    });

    it('welcome', (done) => {
      chai
        .request(app)
        .get('/api/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equals('welcome');
          done();
          // if (err) done(err);
        });
    });
  });
});

describe('Doctor', function () {
  describe(' POST: /api/doctors/register', (done) => {
    it('Create a new DOctor', (done) => {
      chai
        .request(app)
        .post('/api/doctors/register')
        .type('form')
        .send(doctorDetails)
        .end((err, res) => {
          console.log(res.body);
          expect(res.body).to.be.a('object');
          expect(res.body)
            .to.have.property('Doctor')
            .equals(doctorDetails.name);
          done();
        });
    });
  });
  describe(' POST:  /api/doctors/login', (done) => {
    it('Login a Doctor', (done) => {
      chai
        .request(app)
        .post('/api/doctors/login')
        .type('form')
        .send(doctorLogin)
        .end((err, res) => {
          console.log(res.body);
          token = res.body.token;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.an('string').with.length.above(1);
          done();
        });
    });
  });
});

describe('Patient', function () {
  describe(' POST: /api/patients/register', (done) => {
    it('Register a New Patient', (done) => {
      chai
        .request(app)
        .post('/api/patients/register')
        .set('Authorization', 'Bearer ' + token)
        .type('form')
        .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          patientID = res.body.id;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          done();
        });
    });
    it('Register  Already Present Patient', (done) => {
      chai
        .request(app)
        .post('/api/patients/register')
        .set('Authorization', 'Bearer ' + token)
        .type('form')
        .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('INFO');
          expect(res.body.INFO.reports).to.be.an('array');
          expect(res.body.INFO.name).to.be.equals(PatientDetails.name);
          done();
        });
    });
    it('ACCESS DENIED - NOACCESS TOKEN', (done) => {
      chai
        .request(app)
        .post('/api/patients/register')
        // .set('Authorization', 'Bearer something')
        .type('form')
        .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          //   patientID = res.body.id;
          expect(res).to.have.status(403);
          //   expect(res.body).to.have.property('id');
          done();
        });
    });
    it('ACCESS DENIED - INVALID ACCESS TOKEN', (done) => {
      chai
        .request(app)
        .post('/api/patients/register')
        .set('Authorization', 'Bearer something')
        .type('form')
        .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          //   patientID = res.body.id;
          expect(res).to.have.status(401);
          //   expect(res.body).to.have.property('id');
          done();
        });
    });
  });
});

describe('Report', function () {
  describe('POST:  /api/patients/:id/create_report', (done) => {
    reportStatus.forEach((status) => {
      it(`Create a Report for a  patient| ${status}`, (done) => {
        chai
          .request(app)
          .post(`/api/patients/${patientID}/create_report`)
          .set('Authorization', 'Bearer ' + token)
          .type('form')
          .send({ status: `${status}` })
          .end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('report');
            expect(res.body.report).to.have.property('_id');
            expect(res.body.report)
              .to.have.property('patient')
              .with.length.above(1);
            expect(res.body.report)
              .to.have.property('doctor')
              .with.length.above(1);

            done();
          });
      });
    });
    it('ACCESS DENIED - NOACCESS TOKEN', (done) => {
      chai
        .request(app)
        .post(`/api/patients/${patientID}/create_report`)
        // .set('Authorization', 'Bearer something')
        .type('form')
        .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          //   patientID = res.body.id;
          expect(res).to.have.status(403);
          //   expect(res.body).to.have.property('id');
          done();
        });
    });
    it('ACCESS DENIED - INVALID ACCESS TOKEN', (done) => {
      chai
        .request(app)
        .post(`/api/patients/${patientID}/create_report`)
        .set('Authorization', 'Bearer something')
        .type('form')
        .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          //   patientID = res.body.id;
          expect(res).to.have.status(401);
          //   expect(res.body).to.have.property('id');
          done();
        });
    });
  });
  describe(' GET: /api/patients/:ID/all_reports', () => {
    it('Get all Report Of a Patient', (done) => {
      chai
        .request(app)
        .get(`/api/patients/${patientID}/all_reports`)
        .set('Authorization', 'Bearer ' + token)
        // .type('form')
        // .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body)
            .to.have.property('reports')
            .to.have.property('reports')
            .to.be.an('array');
          expect(res.body.reports).to.have.property('_id');
          expect(res.body.reports).to.have.property('mob');
          expect(res.body.reports).to.have.property('name');

          // expect(res.body.INFO.reports).to.be.an('array');
          // expect(res.body.INFO.name).to.be.equals(PatientDetails.name);
          done();
        });
    });
    it('ACCESS DENIED - NOACCESS TOKEN', (done) => {
      chai
        .request(app)
        .get(`/api/patients/${patientID}/all_reports`)
        // .set('Authorization', 'Bearer something')
        // .type('form')
        // .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          //   patientID = res.body.id;
          expect(res).to.have.status(403);
          //   expect(res.body).to.have.property('id');
          done();
        });
    });
    it('ACCESS DENIED - INVALID ACCESS TOKEN', (done) => {
      chai
        .request(app)
        .get(`/api/patients/${patientID}/all_reports`)
        .set('Authorization', 'Bearer something')
        // .type('form')
        // .send(PatientDetails)
        .end((err, res) => {
          console.log(res.body);
          //   patientID = res.body.id;
          expect(res).to.have.status(401);
          //   expect(res.body).to.have.property('id');
          done();
        });
    });
  });
  describe(' GET: /api/reports/:STATUS', () => {
    reportStatus.forEach((status) => {
      it(`Finding the Records having status| ${status}`, (done) => {
        chai
          .request(app)
          .get(`/api/reports/${status}`)
          .set('Authorization', 'Bearer ' + token)
          // .type('form')
          // .send({ status: `${status}` })
          .end((err, res) => {
            console.log('Response', res.body);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('reports');
            expect(res.body.reports).to.be.an('array');
            expect(res.body.reports[0])
              .to.have.property('status')
              .to.be.equals(status);
            done();
          });
      });
    });
  });
});
