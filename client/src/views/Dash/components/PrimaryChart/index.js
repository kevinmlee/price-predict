import React, { Component } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Box, Typography } from "@mui/material";

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
    /*if (!this.props.state.predictions.hasOwnProperty("seed"))
      this.getPredictions();*/
    /*if (this.props.state.searchQuery)
      this.getPredictions(this.props.state.searchQuery);*/
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
            {this.props.state.selectedCoinName}
          </Typography>

          <Line
            id="primaryChart"
            data={this.props.state.primaryChartData}
            options={options}
          />
        </div>
      </Box>
    );
  };

  render() {
    return (
      <Box id="mainChart" sx={{ paddingBottom: 4 }}>
        {"datasets" in this.props.state.primaryChartData && this.primaryChart()}
      </Box>
    );
  }
}
