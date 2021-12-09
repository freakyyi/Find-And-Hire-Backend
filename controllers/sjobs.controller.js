const scrape = require("../functions/scrape");
// const scrapeJob = require("../models/scrapeJob");
const scholarShip = require("../functions/scholarshipScrape");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.postScrapeJobs = async (req, res, next) => {
  try {
    let query = req.body.query;
    let location = req.body.location;
    let getExpertiniJobs = await scrape.getExpertiniJobs(query, location);
    let gethireejobsgulfJobs = await scrape.gethireejobsgulfJobs(
      query,
      location
    );
    let getjoblumJobs = await scrape.getjoblumJobs(query, location);
    let getbaytJob = await scrape.getbaytJob(query, location);
    let data = [];
    data.push(
      getExpertiniJobs,
      gethireejobsgulfJobs,
      getjoblumJobs,
      getbaytJob
    );

    await sleep(11000);

    if (data === undefined || data === null || data.length === 0) {
      await sleep(11000);
      res.status(400);
      res.json({ error: "No jobs found" });
      console.log("Empty Array");
    } else {
      console.log("helskfhaslkfhjask")
      await sleep(11000);
      console.log(data);
      res.status(200).send(data);
    }

  } catch (error) {
    res.send(error);
  }
};

exports.getScholarShips = async (req, res, next) => {
  try {
    let dept = req.body.dept;
    let query = req.body.query;
    let cardiff = await scholarShip.cardiff(query, dept);
    res.status(200).send(cardiff);
  } catch (error) {
    res.send(error);
  }
};

// exports.getUniversities = async(req,res,next) => {
//   try {
//     let dept = req.body.dept;
//     let query = req.body.query
//     let getUniversitiesinGermany = await scholarShip.getUniversitiesinGermany(query,dept)

//     res.status(200).send(getUniversitiesinGermany);
//   } catch (error) {
//     res.send(error);
//   }
// }
