require("dotenv").config();

const brain = require("brain.js");
const axios = require("axios");
const dayjs = require("dayjs");
const fs = require("fs");

const dateNow = dayjs().unix();
const dateAfter = dayjs(
  new Date().setFullYear(new Date().getFullYear() - 1)
).unix();

const normalize = (x) => x / 10;
const denormalize = (x) => x * 10;

const net1 = new brain.recurrent.RNNTimeStep();
const net2 = new brain.recurrent.LSTMTimeStep();
const net3 = new brain.recurrent.GRUTimeStep();

predict = async (seedData) => {
  const normalizedTrainingData = seedData.map(normalize);
  train(normalizedTrainingData);

  const output1 = net1.forecast(normalizedTrainingData, 10);
  const output2 = net2.forecast(normalizedTrainingData, 10);
  const output3 = net3.forecast(normalizedTrainingData, 10);

  const outputRun1 = net1.run(normalizedTrainingData);
  const outputRun2 = net2.run(normalizedTrainingData);
  const outputRun3 = net3.run(normalizedTrainingData);

  console.log("1) Forecast: ", output1.map(denormalize));
  console.log("2) Forecast: ", output2.map(denormalize));
  console.log("3) Forecast: ", output3.map(denormalize));

  console.log("1) Run: ", outputRun1 * 10);
  console.log("2) Run: ", outputRun2 * 10);
  console.log("3) Run: ", outputRun3 * 10);

  return [output1, output2, output3];
};

train = (normalizedTrainingData) => {
  const config = {
    iterations: 6000,
    learningRate: 0.005,
    errorThresh: 0.02,
    //log: true,
  };

  console.log("\n - Training started. Please wait.\n");
  net1.train([normalizedTrainingData], config);
  net2.train([normalizedTrainingData], config);
  net3.train([normalizedTrainingData], config);
  console.log("\n - Training complete\n");
};

module.exports = {
  /*
  search: async function (req, res, next) {
    const { searchQuery } = req.body;

    const params = {
      query: searchQuery,
      //"-is": "retweet",
      //"-filter": "replies",
      expansions:
        "in_reply_to_user_id,referenced_tweets.id,attachments.media_keys,author_id",
      max_results: 100,
      "tweet.fields": "public_metrics,created_at",
      "media.fields": "preview_image_url,url",
      "user.fields": "profile_image_url",
    };

    try {
      return res.json({
        tweets: await client.get("tweets/search/recent", params),
      });
    } catch (e) {
      console.log(e);
      return res.json({ error: e, twitterResults: [] });
    }
  },
  */
  getPredictions: async function (req, res, next) {
    //const { ticker } = req.body;
    const ticker = "terra-luna";
    let predictions = [];
    let seedData = [];
    let priceData = [];

    const coinGeckoURL =
      "https://api.coingecko.com/api/v3/coins/" +
      ticker +
      "/market_chart/range?vs_currency=usd&from=" +
      dateAfter +
      "&to=" +
      dateNow;

    // set timeout to 5 minutes
    // req.setTimeout(300000, function () {});
    req.setTimeout(0); // no timeout

    await axios.get(coinGeckoURL, {}).then(
      async (response) => {
        const data = response.data.prices;
        priceData = data;

        for (const price of data) seedData.push(price[1]);
        predictions = await predict(seedData);

        return;
      },
      (error) => console.log(error)
    );

    res.json({
      seed: priceData,
      predictions: predictions,
    });
  },
};
