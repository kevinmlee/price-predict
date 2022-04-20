import React, { Component } from "react";

import { Box } from "@mui/material";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import HomeIcon from "@mui/icons-material/Home";
import TwitterIcon from "@mui/icons-material/Twitter";
import RedditIcon from "@mui/icons-material/Reddit";
import InstagramIcon from "@mui/icons-material/Instagram";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SettingsIcon from "@mui/icons-material/Settings";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.props.setAppState("sidebar", false);
      //alert("You clicked outside of me!");
    }
  };

  render() {
    return (
      <Box
        className={"sidebar " + (this.props.state.sidebar && "expanded")}
        ref={this.wrapperRef}
        sx={{}}
      >
        <div className="logo">
          <HdrStrongIcon sx={{ fontSize: "50px" }} />
        </div>

        <div className="menu">
          <div
            className={"menu-item " + (this.props.state.home ? "active" : "")}
            onClick={this.props.changeTab}
            data-tab="home"
          >
            <HomeIcon className="home-icon" />
            <span>Home</span>
          </div>

          <div
            className={"menu-item " + (this.props.state.reddit ? "active" : "")}
            onClick={this.props.changeTab}
            data-tab="reddit"
          >
            <RedditIcon className="reddit-icon" />
            <span>Reddit</span>
          </div>
        </div>
      </Box>
    );
  }
}
