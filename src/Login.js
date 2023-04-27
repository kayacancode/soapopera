import React from 'react'

// allows user to login and authenticate
const CLIENT_ID = "00f843ec4b064746a691a14ccd9d8a84";

const REDIRECT_URI = "http://localhost:3000"

const SCOPE = "streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state"


const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&state=&scope=${SCOPE}`

export default function Login() {
  return (
    <div>
      <div className="text-center">
      <h1 className="text-[#8582d9]  w-full text-center">Welcome to Soap Opera! </h1>
      <p className="text-center  " >Don't take too long in the shower! With Soap Opera you pick the playlist and we pick the best songs to limit your water waste</p>
      <a  className = "text-center" href={AUTH_URL}>Login to Spotify</a>
      </div>
    </div>
  )
}
