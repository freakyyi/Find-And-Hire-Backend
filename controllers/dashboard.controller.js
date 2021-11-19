const mongoose = require('mongoose')
const Seeker = require('../models/seeker')
const Recruiter = require('../models/recruiter')

// exports.generateDashboardData = async (req, res, next) => {
//   try {
//     const response = { payLoad: {}, message: "" };
//     if (req.user.role === "seeker") {
//       // seeker dashboard
//       response.payLoad = {
//         appliedCount: await appliedCount(req.user._id),
//         savedCount: await savedCount(req.user._id),
//         viewedCount: await viewedCount(req.user._id),
//       };
//     } else {
//       // recruiter dashboard
//       response.payLoad = {
//         hotJobGraph: await hotJobGraph(req.user._id),
//         coldJobGraph: await coldJobGraph(req.user._id),
//       };
//     }
//     res.status(200);
//     res.send(response);
//   } catch (error) {
//     next(error);
//   }
// };

// const appliedCount = async (seekerId) => {
//   const applied = await Seeker.findById(seekerId)
//   const applied = await sql.query(
//     `SELECT COUNT(*) as count FROM job_application WHERE applicant_id = '${applicantId}'`
//   );
//   return applied[0].count;
// };

// const savedCount = async (applicantId) => {
//   const saved = await sql.query(
//     `SELECT COUNT(*) as count FROM saved_job WHERE applicant_id = '${applicantId}'`
//   );
//   return saved[0].count;
// };




// const hotJobGraph = async (recruiterId) => {
//     const hotJob = await sql.query(`SELECT job_id as jobId, COUNT(DISTINCT application_id) as count FROM job_application where recruiter_id = '${recruiterId}' group by job_id order by count desc LIMIT 10;`)
//     for (let index = 0; index < hotJob.length; index++) {
//       const element = hotJob[index]
//       hotJob[index].jobTitle = await getJobTitleById(element.jobId)
//     }
//     return hotJob
//   }
  
//   const coldJobGraph = async (recruiterId) => {
//     const coldJob = await sql.query(`SELECT job_id as jobId, COUNT(DISTINCT application_id) as count FROM job_application where recruiter_id = '${recruiterId}' group by job_id order by count asc LIMIT 5;`)
//     for (let index = 0; index < coldJob.length; index++) {
//       const element = coldJob[index]
//       coldJob[index].jobTitle = await getJobTitleById(element.jobId)
//     }
//     return coldJob
//   }


//   const jobsByRecruiter = async (recruiterId) => {
//     const jobList = await Job.find({ recruiter: recruiterId }).exec()
//     const jobIdList = []
//     for (let index = 0; index < jobList.length; index++) {
//       const element = jobList[index]
//       jobIdList.push(element._id)
//     }
//     return jobIdList
//   }