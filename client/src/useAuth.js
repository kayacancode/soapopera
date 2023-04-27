import axios from 'axios'
import React, { useEffect, useState } from 'react'


// handles the authentication
export default function useAuth(code) {
  const [accessToken, set_access_token] = useState()
  const [refreshToken, set_refresh_token] = useState()
  const [expiresIn, set_expires_in] = useState()

  // 
  useEffect(() => {
    axios.post('http://localhost:3001/login', { // sends HTTP POST to /login endpoint
        code,
    })
    .then(res => { // gets response from /login endpoint of the server
      console.log("hiiiiiiiiii")
      console.log(res.data)
      set_access_token(res.data.accessToken)
      set_refresh_token(res.data.refreshToken)
      set_expires_in(res.data.expiresIn)
      window.history.pushState({}, null, "/")
    })
    .catch(error => {
      window.location = "/"
      console.error(error)
    }) 
  }, [code])


  useEffect(() => {
    if (!refreshToken || !expiresIn) return
    const interval = setInterval(() => {
      axios
        .post('http://localhost:3001/refresh', {refreshToken,})
        .then(res => {
          console.log(res.data)
          set_access_token(res.data.accessToken)
          set_expires_in(res.data.expiresIn)
        })
        .catch(error => {
          console.error(error)
          window.location = "/"
        })
      
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval)
  
  }, [refreshToken, expiresIn])

  return accessToken
}


/*
Explanation:
In the server folder, there is currently a server running on port 3001 (or whatever the specified port number is) that listens for a payload.
*/

