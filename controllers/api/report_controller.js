const Report = require('../../models/report');

//get all reports for a particular status
module.exports.getReportsOfStatus = async function (req, res) {
  console.log('hit the report api');
  try {
    const status = req.params.status; //storing the status from the url parameter
    const reports = await Report.find({ status }) //finding all the reports with mentioned status
      .populate('doctor', 'name') //populating doctor field and getting only name
      .populate('patient', 'name'); //populating patient field and getting only name
    const count = await Report.countDocuments({ status }); //count of records
    console.log(reports);
    return res.status(200).json({
      messages: ` Get all reports  of people who are ${status}`,
      count: count,
      reports: reports,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error ',
    });
  }
};
