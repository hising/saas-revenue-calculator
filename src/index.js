import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactGA.initialize("UA-103000963-1");

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
