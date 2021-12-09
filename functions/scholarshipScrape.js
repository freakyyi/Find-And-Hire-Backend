const cheerio = require("cheerio");
const axios = require("axios");

const cardiff = async (query, dept) => {
  bioscience = "biosi";
  engineering = "engin";
  architecture = "archi";
  computer_science = "comsc";
  business = "carbs";
  dentistry = "dentl";
  social_sciences = "socsi";
  history = "share";
  journalism_media = "jomec";
  law_politics = "lawpl";
  medicine = "medic";
  pharmacy = "phrmy";
  psychology = "psych";

  if (dept == "bioscience") {
    dept = "biosi";
  } else if (dept == "engineering") {
    dept = "engin";
  } else if (dept == "architecture") {
    dept = "archi";
  } else if (dept == "computer_science") {
    dept = "comsc";
  } else if (dept == "business") {
    dept = "carbs";
  } else if (dept == "dentistry") {
    dept = "dentl";
  } else if (dept == "social_sciences") {
    dept = "socsi";
  } else if (dept == "history") {
    dept = "share";
  } else if (dept == "journalism_media") {
    dept = "jomec";
  } else if (dept == "law_politics") {
    dept = "lawpl";
  } else if (dept == "medicine") {
    dept = "medic";
  } else if (dept == "pharmacy") {
    dept = "phrmy";
  } else if (dept == "psychology") {
    dept = "psych";
  }

  let jobs = [];
  const indeed_url = "https://www.cardiff.ac.uk/people/search?gscope1=1&";

  try {
    const response = await axios.get(
      indeed_url
        .concat("query=", query)
        .concat(
          "&f.Type%7CB=media%20commentators&f.Type%7CB=available%20for%20postgraduate%20supervision&collection=profiles&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&userkeys=7&form=search-en&num_ranks=20"
        )
        .concat("&f.School%7CZ=".concat(dept))
    );

    const $ = cheerio.load(response.data);


    $(".profile.search-result.with-image.vcard").each((i, el) => {
      const name = $(el).find(".profile-title.fn").text().trim();
      const post = $(el)
        .find(".profile-subtitle")
        .text()
        .trim()
        .replace(/\r?\n|\r/g, "");

      const phone = $(el).find(".profile-contact-telephone").text().trim();
      const email = $(el)
        .find("div.row > div.col-md-5 > dl > dd:nth-child(4) > a")
        .text()
        .trim();

      var job = {
        Name: name,
        post: post,
        phone: phone,
        email: email,
        University : "cardiff"
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};







exports.cardiff = cardiff;
