import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
// hi
function App() {
    const CLIENT_ID = "11e1a8a6d9664d7f9eefd2e7de958a15"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [playlistTracks, setPlaylistTracks] = useState([])
    const [userTracks, setUserTracks] = useState([])

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

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
            getPlaylists()
        }

    }, [token])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const handlePlaylistClick = async (playlist) => {
        setSelectedPlaylist(playlist)

        try {
            const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            setPlaylistTracks(data.items)
        } catch (e) {
            console.error(e)
        }
    }

    const renderPlaylists = () => {
        return playlists.map(playlist => (
            <div key={playlist.id}  className = "text-center" onClick={() => handlePlaylistClick(playlist)}>
                {playlist.images.length ? <img className="mx-auto rounded-md" width={200} src={playlist.images[0].url} alt=""/> : <div>No Image</div>}
            {playlist.name}
        </div>
    ))
}

const renderUserTracks = () => {
    return userTracks.map(userTracks => (
        <div className = "text-center" key={userTracks.id} onClick={() => handlePlaylistClick(userTracks)}>
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
    );
  });
};



return (
    <div className="bg-white">
        <header className="App-header">
            
            {!token ?
            <div className="text-center">
              <h1 className="text-[#8582d9]  w-full text-center">Welcome to Soap Opera! </h1>
            <p className="text-center  " >Don't take too long in the shower! With Soap Opera you pick the playlist and we pick the best songs to limit your water waste</p>
                <a  className = "text-center" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                    to Spotify</a></div>
                : <button  className = "" onClick={logout}>Logout</button>}

            {token ?
                <div className="text-center">

                    <h1 >Select a Spotify Playlist and then scroll to the buttom of the page</h1>

                    <h2 >My Playlists:</h2>
                    {renderPlaylists()}

                    {selectedPlaylist && (
                        <div>
                            <h2>{selectedPlaylist.name} Tracks:</h2>
                            {renderPlaylistTracks()}
                        </div>
                    )}

                </div>

                : <h2></h2>
            }

       

        </header>
    </div>
);
            }
            export default App;