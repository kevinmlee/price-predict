import React, { Component } from "react";

import { Box, Grid, Typography } from "@mui/material";

export default class Predictions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      chartData: {},
    };
  }

  render() {
    const predictions = this.props.state.predictions;
    let predictionOne = {};
    let predictionTwo = {};
    let predictionThree = {};

    console.log("predictions", predictions);

    if (predictions.hasOwnProperty("predictions")) {
      predictionOne = predictions.predictions[0];
      predictionTwo = predictions.predictions[1];
      predictionThree = predictions.predictions[2];
    }

    return (
      <Box id="predictions" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <Typography variant="h5" sx={{ paddingBottom: 2 }}>
          Predictions
        </Typography>

        {predictions.hasOwnProperty("predictions") && (
          <Grid container spacing={2}>
            <Grid item xs={4} className="prediction">
              <div className="card">
                {Object.keys(predictionOne).map((value) => {
                  return (
                    <div value={value}>
                      {(predictionOne[value] * 10).toFixed(2)}
                    </div>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={4} className="prediction">
              <div className="card">
                {Object.keys(predictionTwo).map((value) => {
                  return (
                    <div value={value}>
                      {(predictionTwo[value] * 10).toFixed(2)}
                    </div>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={4} className="prediction">
              <div className="card">
                {Object.keys(predictionThree).map((value) => {
                  return (
                    <div value={value}>
                      {(predictionThree[value] * 10).toFixed(2)}
                    </div>
                  );
                })}
              </div>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  }
}
