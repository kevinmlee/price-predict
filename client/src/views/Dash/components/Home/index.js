import React, { Component } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

import { Box } from "@mui/material";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      recent: false,
      popular: true,
    };

    this.wrapperRef = React.createRef();
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    //document.addEventListener("mousedown", this.handleClickOutside);
    if (!this.props.state.predictions.hasOwnProperty("seed"))
      this.getPredictions();
  };

  componentWillUnmount = () => {
    //document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  getPredictions = async (ticker) => {
    console.log(
      "getting predictions. please wait. this could take a few minutes"
    );

    return await axios
      .get("/brain/get/predictions", {
        ticker: "terra-luna",
      })
      .then(
        (response) => {
          this.props.setAppState("predictions", response.data);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  render() {
    console.log("predictions", this.props.state.predictions);
    const predictions = this.props.state.predictions;

    return (
      <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <h2>price predict home</h2>

        {predictions.hasOwnProperty("seed") && (
          <Box>
            {predictions.seed.map((seed) => (
              <div>
                {dayjs(seed[0]).format("DD/MM/YYYY")} @ {seed[1].toFixed(2)}
              </div>
            ))}
          </Box>
        )}
      </Box>
    );
  }
}
