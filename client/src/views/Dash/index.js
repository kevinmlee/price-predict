import React, { Component } from "react";
import { Box, Container, Typography } from "@mui/material";

// components
import Home from "./components/Home";

export default class Dash extends Component {
  /*
  constructor(props) {
    super(props);

    this.state = {
      twitter: true,
      reddit: false,
    };
  }
  */

  render() {
    return (
      <Container id="dashboard" maxWidth="100%">
        {this.props.state.home && (
          <Home
            setAppState={this.props.setAppState}
            state={this.props.state}
            updateLocalStorage={this.props.updateLocalStorage}
          />
        )}
      </Container>
    );
  }
}
