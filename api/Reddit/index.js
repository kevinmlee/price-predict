require("dotenv").config();
const https = require("https");
const dayjs = require("dayjs");
const axios = require("axios");

const dateNow = dayjs().unix();
const dateAfter = dayjs(
  new Date().setFullYear(new Date().getFullYear() - 1)
).unix();

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery, filter } = req.body;
    const url =
      "https://www.reddit.com/search.json?q=" + searchQuery + "&sort=" + filter;

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => {
        data += stream;
      });

      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
};
