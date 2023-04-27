import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
import SpotifyPlayer from "./Player";
import Login from "./Login";
import Dashboard from "./Dashboard";
// hi
function App() {
    const CLIENT_ID = "11e1a8a6d9664d7f9eefd2e7de958a15"
    const REDIRECT_URI = "http://localhost:3000"
    // const REDIRECT_URI = "https://soapopera.herokuapp.com/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize?client_id=11e1a8a6d9664d7f9eefd2e7de958a15&redirect_uri=http://localhost:3001&scope=user-read-email%20user-read-private%20streaming&response_type=token"
    const RESPONSE_TYPE = "token"
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [playlistTracks, setPlaylistTracks] = useState([])
    const [userTracks, setUserTracks] = useState([])
    // const spotifyPlayer = window.spotifyPlayer;
    // const [spotifyPlayer, setSpotifyPlayer] = useState(null);

    const code = new URLSearchParams(window.location.search).get("code")



    useEffect(() => {
        const getPlaylists = async () => {
            try {
                const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
                setPlaylists(data.items)
            } catch (e) {
                console.error(e)
            }
        }

        if (token) {
            getPlaylists();
        }
        }, [token]
    )

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const openModal = () => {
      setIsModalOpen(true);
    }

    const handlePlaylistClick = async (playlist) => {
        setSelectedPlaylist(playlist)
        try {
            const {data} = 
                await axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                headers: {Authorization: `Bearer ${token}`},})
            setPlaylistTracks(data.items)
            openModal()
        } catch (e) {
            console.error(e)
        }
    }

    const closeModal = () => {
      setIsModalOpen(false);
    }

    const renderPlaylists = () => {
      return playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="playlist-item-container"
          onClick={() => handlePlaylistClick(playlist)}
        >
          {playlist.images.length ? (
            <img
              className="playlist-image rounded-md"
              width={200}
              src={playlist.images[0].url}
              alt=""
            />
          ) : (
            <div>No Image</div>
          )}
          <span className="playlist-name">{playlist.name}</span>
        </div>
      ));
    };

    const renderUserTracks = () => {
        return userTracks.map(userTracks => (
            <div className = "" key={userTracks.id} onClick={() => handlePlaylistClick(userTracks)}>
            {userTracks.name}
        </div>
    ))
    }

    const renderusertracks = () => {
        return userTracks.map(track => {
            <div key={track.track.id}>
    {track.track.name} - {track.track.artists.map(artist => artist.name).join(", ")}

            </div>
        })
    }

    //shuffle playlistTracks
    function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
    }


// const initializeSpotifyPlayer = () => {
//     if (window.Spotify) {
//       const player = new window.Spotify.Player({
//         name: "Soap Opera",
//         getOAuthToken: (cb) => {
//           cb(token);
//         },
//       });
  
//       player.connect();
  
//       player.addListener("ready", ({ device_id }) => {
//         console.log("Ready with Device ID", device_id);
//         setSpotifyPlayer(player);
//       });
  
//       player.addListener("not_ready", ({ device_id }) => {
//         console.log("Device ID has gone offline", device_id);
//       });
//     }
//   };

const renderPlaylistTracks = () => {
  let totalDurationInMs = 0;
  const tracksToRender = [];

  shuffle(playlistTracks);

  for (const track of playlistTracks) {
    const durationInMs = track.track.duration_ms;
    const durationInMin = durationInMs / 60000;

    if (totalDurationInMs + durationInMs <= 480000) {
      tracksToRender.push(track);
      totalDurationInMs += durationInMs;
    } else {
        //do nothing
    }
    }

    return tracksToRender.map(track => {
        const durationInMs = track.track.duration_ms;
        const durationInMin = durationInMs / 60000;
        const durationString = durationInMin.toFixed(2) + ' minutes';
        return (
        <div key={track.track.id}>
            {track.track.name} - {durationString} - {track.track.artists.map(artist => artist.name).join(", ")}
        </div>
        // <div key={track.track.id} onClick={() => {
        //     if (spotifyPlayer) {
        //         spotifyPlayer._options.getOAuthToken((accessToken) => {
        //         axios
        //             .put(
        //             `https://api.spotify.com/v1/me/player/play?device_id=${spotifyPlayer._options.id}`,
        //             { uris: [track.track.uri] },
        //             {
        //                 headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //                 },
        //             }
        //             )
        //             .catch((error) => console.error(error));
        //         });
        //         }
        //     }}
        //     >
        //       {track.track.name} - {durationString} -{" "}
        //       {track.track.artists.map((artist) => artist.name).join(", ")}
        //     </div>
        );
        });
    };

    //displays home screen welcome message
    const WelcomeMessage = () => {
        return (
        <div className="text-center">
            <h1 className="text-[#8582d9]  w-full text-center">Welcome to Soap Opera! </h1>
            <p className="text-center  " >Don't take too long in the shower! With Soap Opera you pick the playlist and we pick the best songs to limit your water waste</p>
            <a  className = "text-center" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        </div>)
    }

    // displays logout button if logged in
    const LoggedIn = () => {
        return (
        <div className="">
            <h1 className="text-[#8582d9]  text-center">Soap Opera </h1>
            <button className = "" onClick={logout}>Logout</button>
        </div>)
    }

    //Shows playlists and waits for user to click on one
    const SelectPlaylist = () => {
        return (
            <div className="text-center">
                <h1>Select a Spotify Playlist</h1>
                <h2>My Playlists:</h2>
                <div className="playlists-grid">{renderPlaylists()}</div>
                {selectedPlaylist && (
                <div>
                    <h2>{selectedPlaylist.name} Tracks:</h2>
                    {isModalOpen && (
                    <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <div className="bg-white p-6 rounded-md max-h-full overflow-y-auto">
                            <button 
                                onClick={closeModal} 
                                className="float-right">X</button>
                            <h2 className="text-xl mb-4">{selectedPlaylist && selectedPlaylist.name} Tracks:</h2>
                        <div>{renderPlaylistTracks()}</div>
                        </div>
                    </div>)}
                </div>)}
            </div>)
    }

    console.log(code)
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