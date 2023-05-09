import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// const loadSpotifyPlayerScript = () => {
//   const script = document.createElement("script");
//   script.src = "https://sdk.scdn.co/spotify-player.js";
//   script.async = true;
//   document.body.appendChild(script);
// };

// loadSpotifyPlayerScript();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
