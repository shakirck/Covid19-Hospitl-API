const jwt = require("jsonwebtoken");
const Patient = require("../../models/patients");
const Doctor = require("../../models/doctors");
const Report = require("../../models/report");

module.exports.createPatient = async function (req, res) {
  //TODO: create a patient in db

  try {
    //finding a patient with specified mobile number and if present populating the reports of the patient
    const patient = await Patient.findOne({ mob: req.body.mob }).populate(
      "reports"
    );

    //patient not present  so create a new patient in the db
    if (!patient) {
      const newPatient = await Patient.create({
        mob: req.body.mob,
        name: req.body.name,
      });
      return res.status(200).json({
        message: "New Patient added ",
        id: newPatient.id,
      });
    }

    //returning the patients info stored int db
    return res.status(200).json({
      message: "patients Info",
      INFO: patient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error ",
    });
  }
};

//create a report for the patient
module.exports.createReport = async function (req, res) {
  const patient = await Patient.findById(req.params.id);
  const doctor = await Doctor.findById(req.doctor._id);

  try {
    const newReport = await Report.create({
      doctor: doctor.id,
      patient: patient.id,
      status: req.body.status,
    });
    patient.reports.push(newReport); //adding report to the patient
    patient.save();
    doctor.patientsTreated.push(patient.id); //adding patient to the list of patients treated by a doctor
    doctor.save();
    return res.status(200).json({
      // patient:patient,
      // Doctor:doctor.name,
      // status : req.body.status,
      message: "New Report Created",
      report: newReport,
    });
  } catch (error) {
    console.log("error while creating report ", error);
    return res.status(500).json({
      message: "Internal Server Error ",
    });
  }
};

// get all reports of a patient
module.exports.allReports = async function (req, res) {
  try {
    const patient = await Patient.findById(req.params.id).populate("reports"); //finding a patient and populating the reports
    // const reports = patient['reports'];
    // console.log(typeof reports));
    let currentPatient = patient.toObject();
    currentPatient.reports.sort((doc1, doc2) => {
      //sorting the report by report created time
      return doc2.createdAt - doc1.createdAt;
    });
    return res.status(200).json({
      message: "all reports ",
      reports: currentPatient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error ",
    });
  }
};
