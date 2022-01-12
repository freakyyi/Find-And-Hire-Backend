const scrape = require("../functions/scrape");
// const scrapeJob = require("../models/scrapeJob");
const scholarShip = require("../functions/scholarshipScrape");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.postScrapeJobs = async(req, res, next) => {
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
            console.log("helskfhaslkfhjask");
            await sleep(11000);
            console.log(data);
            res.status(200).send(data.flat());
        }
    } catch (error) {
        res.send(error);
    }
};

exports.getScholarShips = async(req, res, next) => {
    try {
        let dept = req.body.dept;
        let country = req.body.country;
        let cardiff = await scholarShip.cardiff(country, dept);
        let tartu = await scholarShip.tartu(country, dept);
        let nust = await scholarShip.nust(country);
        let tufts = await scholarShip.tufts(country, dept);
        let miami = await scholarShip.miami(country, dept);
        let cyprus = await scholarShip.cyprus(country, dept);
        let data = [];
        data.push(cardiff, tartu, nust, tufts, miami, cyprus);

        if (data === undefined || data === null || data.length === 0) {
            res.status(400);
            res.json({ error: "No Professors found" });
            console.log("Empty Array");
        } else {
            console.log("Found");
            console.log(data.flat());
            res.status(200).send(data.flat());
        }
    } catch (error) {
        res.send(error);
    }
};