import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';

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

    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })

        setArtists(data.artists.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
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
            <div key={playlist.id} onClick={() => handlePlaylistClick(playlist)}>
                {playlist.images.length ? <img width={"100%"} src={playlist.images[0].url} alt=""/> : <div>No Image</div>}
            {playlist.name}
        </div>
    ))
}

const renderUserTracks = () => {
    return userTracks.map(userTracks => (
        <div key={userTracks.id} onClick={() => handlePlaylistClick(userTracks)}>
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

const renderPlaylistTracks = () => {
  return playlistTracks.map(track => {
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
    <div className="App">
        <header className="App-header">
            <h1 className="text-gray">Welcome to Soap Opera! </h1>
            {!token ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                    to Spotify</a>
                : <button onClick={logout}>Logout</button>}

            {token ?
                <div>
                    <h1>Select a Spotify Playlist</h1>

                    <h2>My Playlists:</h2>
                    {renderPlaylists()}

                    {selectedPlaylist && (
                        <div>
                            <h2>{selectedPlaylist.name} Tracks:</h2>
                            {renderPlaylistTracks()}
                        </div>
                    )}

                </div>

                : <h2>Please login</h2>
            }

            {artists.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    {renderArtists()}
                </div>
            )}

        </header>
    </div>
);
            }
            export default App;