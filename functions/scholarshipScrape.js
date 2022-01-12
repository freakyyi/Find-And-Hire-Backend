const cheerio = require("cheerio");
const axios = require("axios");
const { array } = require("joi");
const { contains } = require("cheerio");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const cardiff = async (country, dept) => {
  if (country == "uk") {
    if (dept == "bioscience") {
      dept = "biosi";
    } else if (dept == "engineering") {
      dept = "engin";
    } else if (dept == "architecture") {
      dept = "archi";
    } else if (dept == "computer science") {
      dept = "comsc";
    } else if (dept == "business") {
      dept = "carbs";
    } else if (dept == "dentistry") {
      dept = "dentl";
    } else if (dept == "social sciences") {
      dept = "socsi";
    } else if (dept == "history") {
      dept = "share";
    } else if (dept == "journalism media") {
      dept = "jomec";
    } else if (dept == "law") {
      dept = "lawpl";
    } else if (dept == "medicine") {
      dept = "medic";
    } else if (dept == "pharmacy") {
      dept = "phrmy";
    } else if (dept == "psychology") {
      dept = "psych";
    }
  }

  let jobs = [];
  const indeed_url = "https://www.cardiff.ac.uk/people/search?gscope1=1&";

  try {
    const response = await axios.get(
      indeed_url
        .concat("query=", "")
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
        .replace(/\r?\n|\r/g, "")
        .trim();

      const link = $(el).find(".profile-title.fn > a").attr("href");

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
        link: link,
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};

const tartu = async (country, dept) => {
  if (country == "estonia") {
    if (dept == "bioscience") {
      dept = "molekulaar-rakubioloogia-instituut";
    } else if (dept == "math") {
      dept = "matemaatika-statistika-instituut";
    } else if (dept == "computer science") {
      dept = "arvutiteaduse-instituut";
    } else if (dept == "physics") {
      dept = "fuusika-instituut";
    } else if (dept == "earthscience") {
      dept = "okoloogia-maateaduste-instituut";
    }
  }
  let jobs = [];
  const indeed_url = "https://www.ut.ee/en/kontakt/";

  try {
    const response = await axios.get(indeed_url.concat(dept));

    const $ = cheerio.load(response.data);

    $(
      "#block-system-main > div > div > div > div > div > div:nth-child(3) > div > div > div > table > tbody > tr"
    ).each((i, el) => {
      const name = $(el)
        .find("td.views-field.views-field-field-ut-employee-fname")
        .text()
        .trim()
        .replace(/\t/g, "")
        .replace(/\s+/g, " ");

      const post = $(el)
        .find("td.views-field.views-field-field-ut-profession-eng-title")
        .text()
        .trim()
        .replace(/\r?\n|\r/g, "");

      const phone = $(el)
        .find("td.views-field.views-field-field-ut-employee-phone")
        .text()
        .trim()
        .split(" ");
      const email = $(el).find(".spamspan").text().trim();

      var job = {
        Name: name,
        post: post,
        phone: phone[0].concat(phone[1]),
        email: email,
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};

const nust = async (country) => {
  if (country == "pakistan") {
    let jobs = [];
    const indeed_url = "https://seecs.nust.edu.pk/faculty/";

    try {
      const response = await axios.get(indeed_url);

      const $ = cheerio.load(response.data);

      $(".col-lg-4.mb-4").each((i, el) => {
        const name = $(el).find(".name").text().trim();

        const post = $(el)
          .find(".position-others")
          .text()
          .trim()
          .replace(/\r?\n|\r/g, "");

        // const phone = $(el).find("td.views-field.views-field-field-ut-employee-phone").text().trim().split(" ");
        const email = $(el).find(".email").text().trim();
        const linkBuild = "https://seecs.nust.edu.pk/faculty/";
        const link = $(el).find(".content-area-middle > a").attr("href");
        var job = {
          Name: name,
          post: post,
          link: linkBuild.concat(link),
          email: email,
        };

        jobs.push(job);
      });
      return jobs;
    } catch (error) {
      console.log(error);
    }
  }
};

const tufts = async (country, dept) => {
  if (country == "usa") {
    if (dept == "bioscience") {
      dept = "bme";
    } else if (dept == "electrical computer engineering") {
      dept = "ece";
    } else if (dept == "mechanical engineering") {
      dept = "me";
    } else if (dept == "chemical engineering") {
      dept = "chbe";
    } else if (dept == "computer science") {
      dept = "cs";
    }
  }
  let jobs = [];
  const indeed_url = "https://engineering.tufts.edu/"
    .concat(dept)
    .concat("/people/faculty");
  try {
    const response = await axios.get(indeed_url);

    const $ = cheerio.load(response.data);

    $(".person__card").each((i, el) => {
      const name = $(el)
        .find(".person__text")
        .text()
        .trim()
        .replace(/\t/g, "")
        .replace(/\s+/g, " ");

      const post = $(el)
        .find(".person_related_appts")
        .text()
        .trim()
        .replace(/\r?\t|\r/g, "").replace(/\r?\n|\r/g, "");

      // const phone = $(el).find("td.views-field.views-field-field-ut-employee-phone").text().trim().split(" ");
      const email = $(el)
        .find(
          "div.person__details > div.person__contact > div > div > a > span"
        )
        .text()
        .trim();
      const linkBuild = "https://engineering.tufts.edu";
      const link = $(el).find(".person__title-link").attr("href");
      var job = {
        Name: name,
        post: post,
        email: email,
        link: linkBuild.concat(link),
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};

const miami = async (country, dept) => {
  if (country == "florida") {
    if (dept == "engineering") {
      dept = "engineering";
    } else if (dept == "architecture") {
      dept = "architecture";
    } else if (dept == "law") {
      dept = "law";
    } else if (dept == "arts and science") {
      dept = "as";
    } else if (dept == "business") {
      dept = "business";
    }
  } else {
    return;
  }
  let jobs = [];
  const indeed_url = "https://people.miami.edu/schools-and-colleges/"
    .concat(dept)
    .concat("/index.html");

  try {
    const response = await axios.get(indeed_url);

    const $ = cheerio.load(response.data);

    $(
      "div.collection-wrapper > ul > li> div.profile-simple-table.clearfix.show-for-large-up"
    ).each((i, el) => {
      const name = $(el)
        .find(".url-rewrite")
        .text()
        .trim()
        .replace(/\t/g, "")
        .replace(/\s+/g, " ");

      const post = $(el)
        .find(" div.small-12.large-4.columns.profile-name > p")
        .text()
        .trim()
        .replace(/\r?\n|\r/g, "");

      const phone = $(el)
        .find("div.small-12.large-4.columns.profile-contact-email > span > a")
        .text()
        .trim();
      const email = $(el)
        .find("div.small-12.large-4.columns.profile-contact-email > a")
        .text()
        .trim();
      const link = $(el).find(".url-rewrite").attr("href").trim();

      var job = {
        Name: name,
        post: post,
        phone: phone,
        email: email,
        link: "https:".concat(link),
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};

const cyprus = async (country, dept) => {
  if (country == "nicosia") {
    if (dept == "agriculture sciences") {
      dept = "1053/714";
    } else if (dept == "engineering") {
      dept = "1027/11";
    } else if (dept == "law") {
      dept = "983/699";
    } else if (dept == "arts and science") {
      dept = "911/588";
    } else if (dept == "dentistry") {
      dept = "10374/848";
    } else if (dept == "medicine") {
      dept = "10373/841";
    } else if (dept == "pharmacy") {
      dept = "4186/712";
    }
  }
  let jobs = [];
  const indeed_url = "https://www.ciu.edu.tr/academic-staff/".concat(dept);

  try {
    const response = await axios.get(indeed_url);

    const $ = cheerio.load(response.data);

    $("#wrapper > section.academic-staff > div > div > div").each((i, el) => {
      const name = $(el)
        .find("div > figure > figcaption > h5")
        .text()
        .trim()
        .replace(/\t/g, "")
        .replace(/\s+/g, " ");

        // const nameForEmail = name.indexOf("Dr.",3)
        // const nameForEmailNew = nameForEmail[1]
        // console.log('am',nameForEmail)

      function randomString(length, chars) {
        var result = "";
        for (var i = length; i > 0; --i)
          result += chars[Math.floor(Math.random() * chars.length)];
        return result;
      }
      var rString = randomString(7, name);
      const email = "@ciu.edu.tr";
      const link = $(el).find(".staff-details > figure >a").attr('href')
      var job = {
        Name: name,
        phone: "N/A",
        post: "N/A",
        link: link,
        email: rString.concat(email).trim(),
      };
      jobs.push(job);
    });
    return jobs;
  } catch (error) {
    console.log(error);
  }
};


exports.cardiff = cardiff;
exports.tartu = tartu;
exports.nust = nust;
exports.tufts = tufts;
exports.miami = miami;
exports.cyprus = cyprus;
