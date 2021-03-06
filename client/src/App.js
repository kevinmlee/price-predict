import React, { Component } from "react";
import dayjs from "dayjs";
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect,
} from "react-router-dom";
//import moment from "moment";
//import ReactNotification from "react-notifications-component";
//import "react-notifications-component/dist/theme.css";

import { Backdrop, Box, CircularProgress } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./styles/main.css";

// components
import Header from "./views/Header";
import Sidebar from "./views/Sidebar";
import Dash from "./views/Dash";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // header
      scrollStatus: "",

      // sidebar
      sidebar: false,
      home: true,
      settings: false,

      // back to top button
      backToTop: false,

      predictions: {},
      primaryChartData: {},

      searchQuery: "",
      previousSearchQuery: "",

      backdropImage: "",
      backdropToggle: false,
      loadingBackdrop: false,
      searchQueryBlankError: false,
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", () => {
      let scrollStatus = "sticky";
      let backToTop = false;
      if (window.scrollY === 0) scrollStatus = "top";
      if (window.scrollY > 600) backToTop = true;

      this.setState({ scrollStatus, backToTop });
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", null);
  };

  changeTab = (event) => {
    const tabs = [
      "home",
      "twitter",
      "reddit",
      "instagram",
      "youtube",
      "trends",
      "settings",
    ];
    const selectedTab = event.currentTarget.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ sidebar: false });
  };

  setAppState = async (name, value) => {
    await this.setState({ [name]: value });
  };

  toggle = (state) => {
    this.setState({ [state]: !this.state[state] });
  };

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  alerts = () => {
    /*
    if (this.state.searchQueryBlankError)
      return (
        <Alert severity="error">
          Search query cannot be blank. Please enter a search query and try
          again.
        </Alert>
      );
    */
  };

  updateLocalStorage = (key, value) => {
    let userSettings = {};

    if (localStorage.getItem("userSettings"))
      userSettings = JSON.parse(localStorage.getItem("userSettings"));

    userSettings[key] = value;

    localStorage.setItem("userSettings", JSON.stringify(userSettings));
  };

  reset = async () => {
    await this.setState({
      searchQuery: "",
      previousSearchQuery: "",
      tweetsByUserId: [],
      tweetsByRecent: [],
      twitterUser: {},
      twitterError: false,
      redditHot: [],
      redditNew: [],
      redditHotWorldNews: [],
      redditHotGlobal: [],
      youtubeVideosRelevance: {},
      youtubeVideosRating: {},
      youtubeVideosDate: {},
    });
  };

  imageBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("backdropToggle")}
        onClick={() => this.toggle("backdropToggle")}
      >
        <img src={this.state.backdropImage} alt="" />
      </Backdrop>
    );
  };

  loadingBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("loadingBackdrop")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  initialSearchBackdrop = () => {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={() => this.toggle("loadingBackdrop")}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  };

  backToTopButton = () => {
    return (
      <div className="back-to-top" onClick={() => this.scrollToTop()}>
        <KeyboardArrowUpIcon />
      </div>
    );
  };

  getPredictions = async (ticker) => {
    await this.setState({ loadingBackdrop: true });

    return await axios
      .put("/brain/get/predictions", {
        ticker: ticker,
      })
      .then(
        async (response) => {
          const seed = response.data.seed;
          this.setState({ predictions: response.data });

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
                borderColor: borderColor,
              },
            ],
          };

          //await this.setState({ chartData });
          await this.setState({
            primaryChartData: chartData,
            loadingBackdrop: false,
          });
        },
        (error) => {
          console.log(error);
        }
      );
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
      <Box>
        <Header
          state={this.state}
          setAppState={this.setAppState}
          updateLocalStorage={this.updateLocalStorage}
          getPredictions={this.getPredictions}
          toggle={this.toggle}
          reset={this.reset}
        />
        <Sidebar
          state={this.state}
          setAppState={this.setAppState}
          changeTab={this.changeTab}
          toggle={this.toggle}
        />

        {this.alerts()}

        <div id="main-content">
          <Router>
            <Switch>
              <Route exact path="/">
                <Dash
                  state={this.state}
                  setAppState={this.setAppState}
                  updateLocalStorage={this.updateLocalStorage}
                />
              </Route>
            </Switch>
          </Router>
        </div>

        {this.state.backdropToggle && this.imageBackdrop()}
        {this.state.loadingBackdrop && this.loadingBackdrop()}
        {this.state.backToTop && this.backToTopButton()}
      </Box>
    );
  }
}
