const cheerio = require("cheerio");
const axios = require("axios");

// scrapping expertini.com

const getExpertiniJobs = async(query, location) => {
    const globalData = [];
    const getResp = async(uri) => {
        try {
            const resp = await axios.get(uri);
            return resp;
        } catch (e) {
            console.log("The Job Has been Expired Expertini");
            return;
        }
    };

    (async(uri) => {
        // console.log("now in expertini");

        try {
            let resp = await getResp(
                uri.concat("q=".concat(query)).concat("&").concat("l=".concat(location))
            );
            if (resp === undefined) {
                console.log("Continuing");
                return;
            }
            const $ = cheerio.load(resp.data);
            const jobs = $(".job-info");
            if (jobs !== undefined) {
                if (jobs) {
                    jobs
                        .map(function() {
                            const link = $(this).find(".job-title").find("a").attr("href");
                            const title = $(this).find(".job-title").find("a").text().trim();
                            const company_name = $(this)
                                .find(".info-company")
                                .find(".company")
                                .text()
                                .trim();
                            const location = $(this).find(".address").find("a").text().trim();
                            if (typeof link === "string" || link !== undefined) {
                                if (link) {
                                    getResp(link).then((res) => {
                                        try {
                                            if (res !== undefined || typeof res === "string") {
                                                const $$ = cheerio.load(res.data);
                                                const date = $$(
                                                        "#job-detail-content > div.job-detail-info > ul > li.posted > div > div.content"
                                                    )
                                                    .text()
                                                    .trim();

                                                const summary = $$(
                                                        "#job-detail-content > div.job-detail-about"
                                                    )
                                                    .text()
                                                    .trim()
                                                    .split(",");

                                                const salary = $$(
                                                        "#job-detail-content > div.job-detail-info > ul > li.salary > div > div.content"
                                                    )
                                                    .text()
                                                    .trim();

                                                var jobs = {
                                                    jobTitle: title,
                                                    summary: summary[0],
                                                    company: company_name,
                                                    linkToJob: link,
                                                    location: location,
                                                    salary: salary,
                                                    date: date,
                                                };
                                                // console.log(jobs)
                                                globalData.push(jobs);
                                                // Promise.resolve(globalData.push( jobs ));
                                            }
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    });
                                }
                            } else {
                                return;
                            }
                        })
                        .get();
                }
            }
        } catch (e) {
            console.error(e);
            console.log("error finding jobs in expertini");
        }
    })("https://pk.expertini.com/jobs/jobs/?");
    return globalData;
};

// Scraping hireejobsgulf
const gethireejobsgulfJobs = async(query, location) => {
    ////////// NEW METHOD - hirejobsgulf //////////////////

    const globalData = [];
    const getResp = async(uri) => {
        try {
            const resp = await axios.get(uri);
            return resp;
        } catch (e) {
            console.log("The Job Has been Expired Hiregulf");
            return;
        }
    };

    (async(uri) => {
        // console.log("now in hirejobsgulf");

        try {
            let resp = await getResp(
                uri.concat(query.replace(" ", "-")).concat("-jobs-in-").concat(location)
            );
            const $ = cheerio.load(resp.data);
            const jobs = $(".col-sm-12.job-rol-list");
            if (jobs) {
                jobs
                    .map(function() {
                        const title = $(this)
                            .find(".col-sm-12.job-rol")
                            .find("h4")
                            .find("a")
                            .text()
                            .trim();

                        const company_name = $(this)
                            .find(".col-sm-12.job-rol")
                            .find("span")
                            .find("a")
                            .text()
                            .trim();

                        const job_url = $(this).find("h4").find("a").attr("href");
                        let location = $(this).find(".loc").text().trim().split(",");
                        const date = $(this).find(".datepost").text().trim();

                        let summary = $(this)
                            .find(".col-sm-12.job-rol-list > p")
                            .text()
                            .trim()
                            .replace(/\s\s+/g, " ");
                        if (summary == "") {
                            summary = $(this)
                                .find(".col-sm-12.job-rol-list > ul > li")
                                .text()
                                .trim()
                                .replace(/\s\s+/g, " ");
                            if (summary == "") {
                                summary = $(this)
                                    .find(".col-sm-12.job-rol-list > ol > li")
                                    .text()
                                    .trim()
                                    .replace(/\s\s+/g, " ");
                            }
                        }
                        let newloc;
                        let origin;

                        if (location[1] === " Pakistan") {
                            newloc = location[1];
                            origin = location[0].concat(",").concat(newloc);
                            // console.log("in if block");

                            if (job_url) {
                                getResp(job_url).then((res) => {
                                    const $$ = cheerio.load(res.data);

                                    const salary = $$(
                                            "body > div.col-lg-12.body-serchdiv > div > div.job-header > div > div.col-lg-12.dtls-job > div > table > tbody > tr:nth-child(3) > td:nth-child(2)"
                                        )
                                        .text()
                                        .trim();

                                    var jobs = {
                                        jobTitle: title,
                                        summary: summary,
                                        company: company_name,
                                        linkToJob: job_url,
                                        location: origin,
                                        salary: salary,
                                        date: date,
                                    };
                                    // console.log(jobs)
                                    globalData.push(jobs);
                                    // Promise.resolve(globalData.push( jobs ));
                                });
                            }
                        } else {
                            return "No jobs available in hireegulfjobs";
                        }
                    })
                    .get();
            }
        } catch (e) {
            console.error(e);
        }
    })("http://www.hireejobsgulf.com/search-jobs/");
    return globalData;

    ////////// NEW METHOD - hirejobsgulf //////////////////
};

// Scrapping bayt
const getbaytJobs = async(query, location) => {
    // bayt jobs new method
    const globalData = [];
    const getResp = async(uri) => {
        try {
            const resp = await axios.get(uri);
            return resp;
        } catch (e) {
            // console.log(e);
            console.log("The Job Has been Expired Bayt");
            return;
        }
    };

    (async(uri) => {
        // console.log("now in bayt");

        try {
            let resp = await getResp(
                uri
                .concat(query.replace(" ", "-"))
                .concat("-jobs-in-")
                .concat(location)
                .concat("?filters%5Bjb_last_modification_date_interval%5D%5B%5D=2"), {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36",
                    },
                }
            );
            const $ = cheerio.load(resp.data);
            const jobs = $(".has-pointer-d");
            if (jobs) {
                jobs
                    .map(function() {
                        const title = $(this)
                            .find("div")
                            .find("h2")
                            .find("a")
                            .text()
                            .trim();
                        const company_name = $(this)
                            .find(".t-small")
                            .find(".p10r")
                            .text()
                            .trim()
                            .replace("\t", "")
                            .split("-");
                        const link = $(this).find("div").find("h2").find("a").attr("href");
                        const job_url = "https://www.bayt.com".concat(link);
                        const getting_location = $(this)
                            .find(".t-small")
                            .find(".p10r")
                            .text()
                            .trim()
                            .replace("\t", "")
                            .split("-");
                        const location = getting_location[1].trim();
                        const summary = $(this).find(".t-small").find("p").text().trim();
                        if (job_url) {
                            getResp(job_url).then((res) => {
                                const $$ = cheerio.load(res.data);
                                const date = $$(
                                        "#job_card > div.card-head > div.media-d.is-reversed.t-center-m > div > ul > li.t-mute > span:nth-child(1)"
                                    )
                                    .text()
                                    .trim();

                                const salary = $$(
                                        "#job_card > div:nth-child(6) > dl > div:nth-child(6) > dd"
                                    )
                                    .text()
                                    .trim();

                                var jobs = {
                                    jobTitle: title,
                                    summary: summary,
                                    company: company_name[0],
                                    linkToJob: job_url,
                                    location: location,
                                    salary: salary,
                                    date: date,
                                };
                                // console.log(jobs)
                                globalData.push(jobs);
                                // Promise.resolve(globalData.push( jobs ));
                            });
                        }
                    })
                    .get();
            }
        } catch (e) {
            // console.error(e);
            return;
        }
    })("https://www.bayt.com/en/pakistan/jobs/");
    return globalData;
    ////////// NEW METHOD - baytjobs //////////////////
};

// Scrapping joblum
const getjoblumJobs = async(query, location) => {
    ////////// NEW METHOD - JOBLUM //////////////////
    const globalData = [];
    const getResp = async(uri) => {
        try {
            const resp = await axios.get(uri);
            return resp;
        } catch (e) {
            console.log("The Job Has been Expired joblum");
            return;
        }
    };

    (async(uri) => {
        // console.log("now in joblum");

        try {
            let resp = await getResp(
                uri
                .concat("q=".concat(query.replace(" ", "+")))
                .concat("&sort=1")
                .concat("&lo%5B%5D=".concat(location)), {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36",
                    },
                }
            );
            const $ = cheerio.load(resp.data);
            const jobs = $(".col-md-10.col-xs-12.item-details");
            if (jobs) {
                jobs
                    .map(function() {
                        const title = $(this)
                            .find(".job-title")
                            .find("a")
                            .find("span")
                            .text()
                            .trim();
                        let company_name = $(this)
                            .find(".company-meta")
                            .find(".company-name")
                            .find("a")
                            .text()
                            .trim();
                        if (company_name == "") {
                            company_name = "Not Available";
                        }
                        const link = $(this).find(".job-title").find("a").attr("href");
                        const job_url = "https://pk.joblum.com".concat(link);
                        const location = $(this)
                            .find(".company-meta")
                            .find(".location.location-desktop")
                            .find("span")
                            .text()
                            .trim();
                        const date = $(this)
                            .find(".new-time")
                            .find("span")
                            .find(".time1.job-date")
                            .text()
                            .trim();
                        if (job_url) {
                            getResp(job_url).then((res) => {
                                const $$ = cheerio.load(res.data);
                                let summary = $$(
                                        "body > div.container.job-page > div > div.col-sm-8.job-main-col > div.about-job.content-card > span > p:nth-child(2)"
                                    )
                                    .text()
                                    .trim();

                                if (summary == "") {
                                    summary = "Not Available";
                                }

                                let salary = $$(
                                        "body > div.container.job-page > div > div.col-sm-8.job-main-col > div.job-main-card.content-card > div.row > div.col-sm-8.col-sm-pull-4 > p:nth-child(3)"
                                    )
                                    .text()
                                    .trim();

                                if (salary == "") {
                                    salary = "Not Specified";
                                }

                                var jobs = {
                                    jobTitle: title,
                                    summary: summary,
                                    company: company_name,
                                    linkToJob: job_url,
                                    location: location,
                                    salary: salary,
                                    date: date,
                                };
                                // console.log(jobs)
                                globalData.push(jobs);
                                // Promise.resolve(globalData.push( jobs ));
                            });
                        }
                    })
                    .get();
            }
        } catch (e) {
            console.error(e);
        }
    })("https://pk.joblum.com/jobs?");
    return globalData;
    ////////// NEW METHOD - JOBLUM //////////////////
};

exports.gethireejobsgulfJobs = gethireejobsgulfJobs;
exports.getExpertiniJobs = getExpertiniJobs;
exports.getjoblumJobs = getjoblumJobs;
exports.getbaytJob = getbaytJobs;