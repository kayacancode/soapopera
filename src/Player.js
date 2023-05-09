import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, tracks }) {
  const [play, setPlay] = useState(false)
  const [trackUris, setTrackUris] = useState([])


  console.log("playlist track: " + tracks)

  useEffect(() => {
    const newTrackUris = tracks.map(track => track.track.uri);
    setTrackUris(newTrackUris)
  }
  , [tracks])


  console.log(trackUris)
  // useEffect(() => setPlay(true), [trackUris])
  useEffect(() => setPlay(true), [tracks])

  if (!accessToken) return null
  
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={trackUris ? trackUris : []}
    />
  )
}