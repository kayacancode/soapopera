import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
import SpotifyPlayer from "./Player";
import Login from "./Login";
import Dashboard from "./Dashboard";
// hi
function App() {

    const code = new URLSearchParams(window.location.search).get("code")


return (
    <div className="bg-white">
        <body className="App-header">
            {code ? <Dashboard code={code}/> : <Login/>}
            {/* {token ? SelectPlaylist() : <h2></h2>} */}
        </body>


    </div>
);
}
export default App;