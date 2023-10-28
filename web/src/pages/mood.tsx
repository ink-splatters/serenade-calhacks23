import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

const emojiBank = '😀,😁,🥹,😅,😂,🥲,😊,🙂,😌,🥰,😋,😝,🤪,😎,🤩,🥳,😒,😞,😔,😟,😖,😩,🥺,😢,😭,😤,😡,🤬,🤯,😳,😱,😰,😓,🤗,🤭,😐,😬,😯,😧,😮,😴,😪,😮,‍🤐,🤧,😷,🤒,🤕,🤠'

export default function Mood() {

    const CLIENT_ID = "1526c36afb8b45ac8e684bb8729215b6"
    const REDIRECT_URI = "http://localhost:3000/mood"

    let [mood, setMood] = useState(emojiBank.split(',')[0])
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        console.log('Code:', code)
        if (code) {
            axios.post('https://accounts.spotify.com/api/token', {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response: any) => {
                const accessToken = response.data.access_token
                axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }).then((response: any) => {
                    const playlists = response.data.items;
                    playlists.forEach((playlist: any) => {
                        axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }).then((response: any) => {
                            const tracks = response.data.items;
                            tracks.forEach((track: any) => {
                                console.log(track.track.name);
                            });
                        });
                    });
                });
            })
        }
    }, [])

    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* mood picker */}
        <div className='flex flex-row items-center justify-center flex-wrap'>
            {emojiBank.split(',').map((emoji, i) => (
            <button key={i} onClick={() => setMood(emoji)} className='text-6xl'>
                {emoji}
            </button>
            ))}
        </div> 
      </div>   
    )
}