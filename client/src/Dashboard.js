import React from 'react'
import useAuth from './useAuth'
import Player from './Player'

export default function Dashboard({code}) {

    const accessToken = useAuth(code)

    return (
    <div>
        <Player accessToken={accessToken} trackUri="spotify:track:7yriqF8s3ESXqwuDxUaleo"/>
    </div>
    )
}
