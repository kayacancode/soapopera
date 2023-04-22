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
    const [savedTracks, setSavedTracks] = useState([]);
  
    // const getToken = () => {
    //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
    //     let token = urlParams.get('access_token');
    // }

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        // getToken()


        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

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
  
    const handleGetPlaylists = () =>{
    axios.get("https://api.spotify.com/v1/me/tracks")
  }
  const renderSavedTracks = () => {
    return savedTracks.map((track) => (
      <div key={track.track.id}>
        {track.track.album.images.length ? (
          <img width={"100%"} src={track.track.album.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {track.track.name}
      </div>
    ));
  };
    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.duration_ms}
            </div>
        ))
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>}
                                <button onClick={getSavedTracks}>Get Saved Tracks</button>


                {token ?
                    <form onSubmit={searchArtists}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                        <button type={"submit"}>Search</button>
                    </form>

                    : <h2>Please login</h2>
                }

                {renderArtists()}

            </header>
        </div>
    );
}

export default App;