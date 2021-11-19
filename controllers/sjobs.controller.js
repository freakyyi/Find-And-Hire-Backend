const scrape = require("../functions/scrape");
const scrapeJob = require("../models/scrapeJob");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.postScrapeJobs = async (req, res, next) => {
  try {
    let query = req.body.query;
    let location = req.body.location;

    // let getExpertiniJobs = await scrape.getExpertiniJobs(query, location);

    let gethireejobsgulfJobs = await scrape.gethireejobsgulfJobs(
      query,
      location
    );
    let getjoblumJobs = await scrape.getjoblumJobs(query, location);
    let getbaytJob = await scrape.getbaytJob(query, location);
    // let getIndeedJobs = await scrape.getIndeedJobs(query, location);
    // let getRozeeJobs = await scrape.getRozeeJobs(query,location)

    let data = 
    (getjoblumJobs)
    //  (getbaytJob)
      // .concat(gethireejobsgulfJobs);
      
 await sleep(7600)

      if(data === undefined || data === null || data.length === 0 ){
        res.status(400)
        res.json({error : "No jobs found"})
        console.log("Empty Array")

      }
      else {
        console.log(data)
        res.status(200).send(data);
      }


    // var result = data.map((data) => ({
    //   jobTitle: data.jobTitle,
    //   companyName: data.company,
    //   summary: data.summary,
    //   linkToJob: data.linkToJob,
    //   location: data.location,
    //   salary: data.salary,
    //   date: data.date,
      
    // }));
    // console.log("data: ", data[{jobTitle}] )
    // // const titleExists = await scrapeJob.findOne({ jobTitle: data[{jobTitle}] });
    // // if (titleExists) return res.status(400).send("Job already Exists");


    // const sJob = scrapeJob.insertMany(result, function (err, result) {
    //   if (err) {
    //     console.log(err);
    //   };
    //   console.log("Success");
    // });
    // const savedJobs = await sJob.save();
    
    

    
    
  } catch (error) {
    res.send(error);
  }
};

exports.getAll = async(req,res,next) => {
  const scrapeJobs = await scrapeJob.find()
  if(!scrapeJobs) {
    res.status(400)
    res.send("No jobs found against the keywords you entered")
    return
  }
  res.status(200)
  res.send(scrapeJobs)
}