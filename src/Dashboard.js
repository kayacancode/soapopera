import React from 'react'
import useAuth from './useAuth'
import Player from './Player'
import Playlist from './Playlist'

export default function Dashboard({code}) {

    const accessToken = useAuth(code)

    return (
    <div>
        {accessToken ? <Playlist accessToken={accessToken}/> : <></>}
    </div>
    )
}
