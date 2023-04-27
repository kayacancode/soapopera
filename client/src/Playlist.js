import {useState, useEffect} from 'react'
import axios from 'axios'
import Player from './Player'


export default function Playlist({accessToken}) {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [playlistTracks, setPlaylistTracks] = useState([])
    const [userTracks, setUserTracks] = useState([])
    const [chosenTrack, setChosenTrack] = useState([])



    useEffect(() => {
        const getPlaylists = async () => {
            try {
                const {data} = await axios.get("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                .catch(error => console.error(error))
                setPlaylists(data.items)
            } catch (e) {
                console.error(e)
            }
        }

        if (accessToken) {
            getPlaylists();
        }
        }, [accessToken]
    )

    const openModal = () => {
        setIsModalOpen(true);
    }

    const handlePlaylistClick = async (playlist) => {
        setSelectedPlaylist(playlist)
        try {
            const {data} = 
                await axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                headers: {Authorization: `Bearer ${accessToken}`},})
            setPlaylistTracks(data.items)
            updateChosenTrack(data.items);
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
                onClick={() => {handlePlaylistClick(playlist);}}
            >
            {playlist.images.length ? (
                <img
                    className="playlist-image rounded-md"
                    width={200}
                    src={playlist.images[0].url}
                    alt=""
                />
                ) : (<div>No Image</div>)
            }
            <span className="playlist-name">{playlist.name}</span>
            </div>
        ));
    };


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


    const renderPlaylistTracks = (tracks) => {
        let totalDurationInMs = 0;
        const tracksToRender = [];

        shuffle(tracks);

        for (const track of tracks) {
            const durationInMs = track.track.duration_ms;
            // const durationInMin = durationInMs / 60000;

            if (totalDurationInMs + durationInMs <= 480000) {
            tracksToRender.push(track);
            totalDurationInMs += durationInMs;
            }
        }
    
        return tracksToRender
    };
    
    const getTracksData = () => {
        // console.log("getTracksData: " + JSON.stringify(chosenTrack))

        return chosenTrack.map(track => {
            const durationInMs = track.track.duration_ms;
            const durationInMin = durationInMs / 60000;
            const durationString = durationInMin.toFixed(2) + ' minutes';

            return (
                <div key={track.track.id}>
                    {track.track.name} - {durationString} - {track.track.artists.map(artist => artist.name).join(", ")}
                </div>
            );
        });
    }


    const updateChosenTrack = (tracks) => {
        const tracksToRender = renderPlaylistTracks(tracks)
        console.log("updateChosenTrack: " + JSON.stringify(tracksToRender))
        setChosenTrack(tracksToRender)
    }

    // console.log("tracksToRender: " + JSON.stringify(tracksToRender))
    // updateChosenTrack(tracksToRender)

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
                                <button onClick={closeModal} className="float-right">X</button>
                                <h2 className="text-xl mb-4">{selectedPlaylist && selectedPlaylist.name} Tracks:</h2>
                                <div>{chosenTrack !== null && getTracksData()}</div>
                            </div>
                        </div>)}
                    </div>
                    )
                }
            </div>
        )
    }

    // console.log("playlist.js----------\n" + JSON.stringify(playlistTracks))
    return (
        <div>
            <Player accessToken={accessToken} tracks={chosenTrack}/>
            {SelectPlaylist()}
        </div>
    )
}
