require("dotenv").config();
const https = require("https");
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

predict = async (seedData, ticker) => {
  const normalizedTrainingData = seedData.map(normalize);
  //train(normalizedTrainingData);

  console.log("\n - Looking for trained network...");
  if (fs.existsSync(ticker + "-net1.json")) {
    console.log("- Reading trained network from file");
    const trainedNet1 = JSON.parse(fs.readFileSync(ticker + "-net1.json"));
    const trainedNet2 = JSON.parse(fs.readFileSync(ticker + "-net2.json"));
    const trainedNet3 = JSON.parse(fs.readFileSync(ticker + "-net3.json"));
    net1.fromJSON(trainedNet1);
    net2.fromJSON(trainedNet2);
    net3.fromJSON(trainedNet3);
  } else {
    console.log("- No trained network found. Training...");
    train(normalizedTrainingData, ticker);
    console.log("- Neural network ready.");
  }

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

train = (normalizedTrainingData, ticker) => {
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

  // save the trained network
  fs.writeFileSync(ticker + "-net1.json", JSON.stringify(net1.toJSON()));
  fs.writeFileSync(ticker + "-net2.json", JSON.stringify(net2.toJSON()));
  fs.writeFileSync(ticker + "-net3.json", JSON.stringify(net3.toJSON()));
};

module.exports = {
  search: async function (req, res, next) {
    const { searchQuery } = req.body;
    const url = "https://api.coingecko.com/api/v3/search?query=" + searchQuery;

    let request = https.get(url, (response) => {
      let data = "";

      response.on("data", (stream) => (data += stream));
      response.on("end", () => res.json(JSON.parse(data)));
    });

    request.on("error", (e) => res.json(e));
  },
  getPredictions: async function (req, res, next) {
    const { ticker } = req.body;

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

    req.setTimeout(0); // no timeout

    await axios.get(coinGeckoURL, {}).then(
      async (response) => {
        const data = response.data.prices;
        priceData = data;

        for (const price of data) seedData.push(price[1]);
        predictions = await predict(seedData, ticker);

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
