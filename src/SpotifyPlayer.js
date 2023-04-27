import React, { useEffect } from "react";

const RickRollPlayer = ({ accessToken, trackUri }) => {
  console.log("made it here\n")
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }) => {
          console.error(message);
      });

      player.addListener('authentication_error', ({ message }) => {
          console.error(message);
      });

      player.addListener('account_error', ({ message }) => {
          console.error(message);
      });

      player.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });

      document.getElementById('togglePlay').onclick = function() {
        player.togglePlay().then(() => {
          console.log('Toggled playback!');
        }).catch(error => {
          console.error('Failed to toggle playback!', error);
        });
      };

      // const playRickRoll = () => {
      //   player.play({ uris: [trackUri] }).then(() => {
      //     console.log('Playing Rick Roll!');
      //   }).catch(error => {
      //     console.error('Failed to play Rick Roll!', error);
      //   });
      // };

      // playRickRoll();
      
    };
    console.log("checkpoint 2")
  }, [accessToken]);

  return (
    <div>
      <h1>Spotify Web Playback SDK Quick Start</h1>
      <button id="togglePlay">Toggle Play</button>
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
    </div>
  );
};

export default RickRollPlayer;
