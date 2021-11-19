const cheerio = require("cheerio");
const axios = require("axios");

// Scrapping indeed

const getIndeedJobs = async (query, location) => {
  let jobs = [];

  const indeed_url = "https://pk.indeed.com/jobs?";

  try {
    const response = await axios.get(
      indeed_url
      .concat("q=".concat(query))
      .concat("=&")
      .concat("l=".concat(location))
      .concat("&radius=0&sort=date")
    );

    const $ = cheerio.load(response.data);
    // looping through each job post

    $('#job_8b83974ea14fa476 > div.slider_container > div > div.slider_item > div').each((i, el) => {
      const title = $(el).find("#job_a8ef5560f0924c21 > div.slider_container > div > div.slider_item > div > table.jobCard_mainContent > tbody > tr > td > div.heading4.color-text-primary.singleLineTitle.tapItem-gutter > h2 > span").text().trim();
      console.log('title',title)
      const summary = $(el)
        .find(".summary")
        .text()
        .replace(/\r?\n|\r/g, "")
        .trim();

      const company_name = $(el).find(".company").text().trim();

      const link = $(el)
        .find("h2")
        .find("a")
        .attr("href")
        .replace(/\r?\n|\r/g, "")
        .trim();
      const job_url = "https://pk.indeed.com"
        .concat(link)
        .replace(/\r?\n|\r/g, "")
        .trim();

      const location = $(el).find(".location").text();

      const date = $(el).find(".date").text();

      let salary = $(el).find(".salaryText").text().trim();

      if (salary == "") {
        salary = "Not Specified";
      }

      var job = {
        jobTitle: title,
        summary: summary,
        company: company_name,
        linkToJob: job_url,
        location: location,
        salary: salary,
        date: date,
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};
// sleep for expert error
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// scrapping expertini.com

const getExpertiniJobs = async (query, location) => {
  const globalData = [];
  const getResp = async (uri) => {
    try {
      const resp = await axios.get(uri);
      return resp;
    } catch (e) {
      console.log("The Job Has been Expired Expertini");
      return;
    }
  };

  (async (uri) => {
    // console.log("now in expertini");

    try {
      let resp = await getResp(
        uri.concat("q=".concat(query)).concat("&").concat("l=".concat(location))
      );
     if(resp === undefined ){
       console.log("Continuing")
       return
     }
        const $ = cheerio.load(resp.data);
      const jobs = $(".job-info");
      if (jobs !== undefined) {
        if (jobs) {
          jobs
            .map(function () {
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
      console.log("error finding jobs in expertini")
    }
  })("https://pk.expertini.com/jobs/jobs/?");
  return globalData;
};

// Scraping hireejobsgulf
const gethireejobsgulfJobs = async (query, location) => {
  ////////// NEW METHOD - hirejobsgulf //////////////////

  const globalData = [];
  const getResp = async (uri) => {
    try {
      const resp = await axios.get(uri);
      return resp;
    } catch (e) {
      console.log("The Job Has been Expired Hiregulf");
      return;
    }
  };

  (async (uri) => {
    // console.log("now in hirejobsgulf");

    try {
      let resp = await getResp(
        uri.concat(query.replace(" ", "-")).concat("-jobs-in-").concat(location)
      );
      const $ = cheerio.load(resp.data);
      const jobs = $(".col-sm-12.job-rol-list");
      if (jobs) {
        jobs
          .map(function () {
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
const getbaytJobs = async (query, location) => {
  // bayt jobs new method
  const globalData = [];
  const getResp = async (uri) => {
    try {
      const resp = await axios.get(uri);
      return resp;
    } catch (e) {
      // console.log(e);
      console.log("The Job Has been Expired Bayt");
      return;
    }
  };

  (async (uri) => {
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
          .map(function () {
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
const getjoblumJobs = async (query, location) => {
  ////////// NEW METHOD - JOBLUM //////////////////
  const globalData = [];
  const getResp = async (uri) => {
    try {
      const resp = await axios.get(uri);
      return resp;
    } catch (e) {
      console.log("The Job Has been Expired joblum");
      return;
    }
  };

  (async (uri) => {
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
          .map(function () {
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

///// SCRAPPING ROZEE.PK ?////////////////////////



//job ( keyword to start scrapping for rozee )
// Scrapping Rozee



// const getRozeeJobs = async (query, location) => {
//   console.log("hgerwe")

//   rawalpindi = "1190";
//   sialkot = "1192";
//   faislabad = "1181";
//   gujranwala = "1182";
//   multan = "1187";
//   peshawar = "1188";
//   quetta = "1189";
//   sargodha = "1191";
//   abbottabad = "2010";
//   bhawalnagar = "2022";
//   hariPur = "2116";
//   jehlum = "2141";
//   mansehra = "2229";
//   sahiwal = "2308";
//   wazirabad = "2384";

//   switch (location) {
//     case "lahore":
//       code = "1185";
//       break;
//     case "islamabad":
//       day = "1180";
//       break;
//     case 2:
//       day = "Tuesday";
//       break;
//     case 3:
//       day = "Wednesday";
//       break;
//     case 4:
//       day = "Thursday";
//       break;
//     case 5:
//       day = "Friday";
//       break;
//     case 6:
//       day = "Saturday";
//   }

//   if (location == "lahore") {
//     location = "1185";
//   } else if (location == "islamabad") {
//     location = "1180";
//   } else if (location == "karachi") {
//     location = "1184";
//   } else if (location == "rawalpindi") {
//     location = "1190";
//   } else if (location == "sialkot") {
//     location = "1192";
//   } else if (location == "faislabad") {
//     location = "1181";
//   } else if (location == "gujranwala") {
//     location = "1182";
//   } else if (location == "multan") {
//     location = "1187";
//   } else if (location == "peshawar") {
//     location = "1188";
//   } else if (location == "quetta") {
//     location = "1189";
//   }

//   const globalData = [];
//   const getResp = async (uri) => {
//     try {
//       const resp = await axios.get(uri);
//       return resp;
//     } catch (e) {
//       console.error(e);
//       return 500;
//     }
//   };

//   (async (uri) => {
//     // console.log("now in rOZEE");

//     try {
//       let resp = await getResp(
//         uri.concat(query.replace(" ", "%20")).concat("/fc/".concat("1180")), {
//           headers: {
//             "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36",
//           },
//         }
//       );
//       const $ = cheerio.load(resp.data);
//       const jobs = $(
//         "#app > div > div.j-area > div.jlist.float-left > div:nth-child(2)"
//       )
//       console.log("ABOVE SEARCGIG")
//       if (jobs) {
//         jobs
//           .map(function () {
//             const title = $(this)
//               .find(".jcont")
//               .find(".jhead")
//               .find("jobt.float-left")
//               .find("h3")
//               .find("a")
//               .text()
//               .trim();

//               // console.log(title)

//             const company_name = $(this)
//               .find(".jcont")
//               .find(".jhead")
//               .find(".cname")
//               .find(".float-left")
//               .find("a")
//               .text()
//               .trim();

//             const job_url = $(this)
//               .find(".jcont")
//               .find(".jhead")
//               .find("h3")
//               .find("a")
//               .attr("href")
//               .trim();
//             const location = $(
//                 "#app > div > div.j-area > div.jlist.float-left > div:nth-child(2) > div.jcont > div.jhead > div > div > bdi > a:nth-child(2)"
//               )
//               .text()
//               .trim();

//               console.log(location)

//             const date = $(
//                 "#app > div > div.j-area > div.jlist.float-left > div:nth-child(2) > div.jfooter > div > div > span:nth-child(1) > i"
//               )
//               .text()
//               .trim();

//             let summary = $$(
//                 "#app > div > div.j-area > div.jlist.float-left > div:nth-child(2) > div.jcont > div.jbody > bdi"
//               )
//               .text()
//               .trim();

//             if (summary == "") {
//               summary = "Not Available";
//             }

//             let salary = $$(
//                 "#app > div > div.j-area > div.jlist.float-left > div:nth-child(3) > div.jfooter > div > div > span:nth-child(3) > span"
//               )
//               .text()
//               .trim();

//             if (salary == "") {
//               salary = "Not Specified";
//             }

//             var jobs = {
//               jobTitle: title,
//               summary: summary,
//               company: company_name,
//               linkToJob: job_url,
//               location: location,
//               salary: salary,
//               date: date,
//             };
//             // console.log(jobs)
//             globalData.push(jobs);
//             // Promise.resolve(globalData.push( jobs ));
//           })
//           .get();
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   })("https://www.rozee.pk/job/jsearch/q/");
//   return globalData;
//   ///// NEW METHOD - ROZEEE ////////////////////
// };

exports.gethireejobsgulfJobs = gethireejobsgulfJobs;
// exports.getExpertiniJobs = getExpertiniJobs;
exports.getjoblumJobs = getjoblumJobs;
exports.getbaytJob = getbaytJobs;
exports.getIndeedJobs = getIndeedJobs;
// exports.getRozeeJobs = getRozeeJobs;