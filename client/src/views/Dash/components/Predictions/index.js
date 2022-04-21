import React, { Component } from "react";

import { Box, Grid, Typography, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default class Predictions extends Component {
  /* constructor(props) {
    super(props);

    this.state = {
      
    };
  }
  */

  render() {
    const predictions = this.props.state.predictions;
    let predictionOne = {};
    let predictionTwo = {};
    let predictionThree = {};

    //console.log("predictions", predictions);

    if (predictions.hasOwnProperty("predictions")) {
      predictionOne = predictions.predictions[0];
      predictionTwo = predictions.predictions[1];
      predictionThree = predictions.predictions[2];
    }

    return (
      <Box id="predictions" sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {predictions.hasOwnProperty("predictions") && (
          <Typography variant="h5" sx={{ paddingBottom: 2 }}>
            Predictions
          </Typography>
        )}

        {predictions.hasOwnProperty("predictions") && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} className="prediction">
              <div className="card">
                <Tooltip title='Time Step Recurrent Neural Network or "RNN". Click to learn more.'>
                  <a
                    href="https://en.wikipedia.org/wiki/Recurrent_neural_network"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography variant="h6">
                      RNNTimeStep
                      <InfoIcon />
                    </Typography>
                  </a>
                </Tooltip>

                {Object.keys(predictionOne).map((value) => {
                  return (
                    <div className="forecast-item" value={value}>
                      {(predictionOne[value] * 10).toFixed(2)}
                    </div>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={12} md={4} className="prediction">
              <div className="card">
                <Tooltip title='Time Step Long Short Term Memory Neural Network or "LSTM". Click to learn more.'>
                  <a
                    href="https://en.wikipedia.org/wiki/Long_short-term_memory"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography variant="h6">
                      LSTMTimeStep <InfoIcon />
                    </Typography>
                  </a>
                </Tooltip>

                {Object.keys(predictionTwo).map((value) => {
                  return (
                    <div className="forecast-item" value={value}>
                      {(predictionTwo[value] * 10).toFixed(2)}
                    </div>
                  );
                })}
              </div>
            </Grid>

            <Grid item xs={12} md={4} className="prediction">
              <div className="card">
                <Tooltip title='Time Step Gated Recurrent Unit or "GRU". Click to learn more.'>
                  <a
                    href="https://en.wikipedia.org/wiki/Gated_recurrent_unit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography variant="h6">
                      GRUTimeStep <InfoIcon />
                    </Typography>
                  </a>
                </Tooltip>

                {Object.keys(predictionThree).map((value) => {
                  return (
                    <div
                      className="forecast-item"
                      value={predictionThree[value]}
                    >
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
