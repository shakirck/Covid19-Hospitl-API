process.env.NODE_ENV = 'test';
const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);
// console.log = function () {};
//models
const Doctor = require('../models/doctors');
const Patient = require('../models/patients');
const Report = require('../models/report');

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
describe('Server Start / ', () => {
  before((done) => {
    Doctor.remove({}, (err) => {
      console.log('Successfully Deleted all contents in the DB');
      //   done();
    });
    Patient.remove({}, (err) => {
      console.log('Successfully Deleted all contents in the DB');
      //   done();
    });

    Report.remove({}, (err) => {
      console.log('Successfully Deleted all contents in the DB');
      //   done();
    });

    done();
  });
  //   before((done) => {

  //   });
  //   before((done) => {

  //   });

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

describe('Doctor', (done) => {
  it('Create a new DOctor', (done) => {
    chai
      .request(app)
      .post('/api/doctors/register')
      .type('form')
      .send(doctorDetails)
      .end((err, res) => {
        console.log(res.body);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('Doctor').equals(doctorDetails.name);
        done();
      });
  });
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

describe('Patient', (done) => {
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
});

describe('Report', (done) => {
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
