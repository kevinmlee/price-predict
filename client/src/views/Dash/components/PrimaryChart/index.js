import React, { Component } from "react";
import dayjs from "dayjs";
import { Box, touchRippleClasses, Typography } from "@mui/material";

//import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
//import "chartjs-plugin-trendline";

export default class PrimaryChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      chartData: {},
    };
  }

  componentDidMount = () => {
    const predictions = this.props.state.predictions;
    if (predictions.hasOwnProperty("seed")) this.buildChart(predictions.seed);
  };

  componentWillUnmount = () => {};

  primaryChart = () => {
    let options = {
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <Box
        className="interest-over-time"
        sx={{ paddingTop: 4, paddingBottom: 2 }}
      >
        <div className="card">
          <Typography variant="h5" sx={{ paddingBottom: 2 }}>
            TICKER
          </Typography>

          <Line
            id="primaryChart"
            data={this.state.chartData}
            options={options}
          />
        </div>
      </Box>
    );
  };

  buildChart = async (seed) => {
    let borderColor = "";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      borderColor = "rgba(255, 255, 255, 1)";
    else if (window.matchMedia("(prefers-color-scheme: light)").matches)
      borderColor = "rgba(0, 0, 0, 1)";

    let chartData = {
      labels: await this.generateLabels(seed),
      datasets: [
        {
          label: "Price",
          data: await this.generateData(seed),
          //backgroundColor: "rgba(255, 255, 255, 1)",
          borderColor: borderColor,
          //backgroundColor: gradient,
          //pointBackgroundColor: "white",
          //borderWidth: 1,
        },
      ],
    };

    await this.setState({ chartData });
  };

  generateLabels = (data) => {
    let labels = [];

    data.forEach((item) => {
      labels.push(dayjs(item[0]).format("DD/MM/YYYY"));
    });

    return labels;
  };

  generateData = (data) => {
    let values = [];

    data.forEach((item) => {
      values.push(item[1]);
    });

    return values;
  };

  render() {
    return (
      <Box id="mainChart" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {"datasets" in this.state.chartData && this.primaryChart()}
      </Box>
    );
  }
}
