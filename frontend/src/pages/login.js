import { Button } from "../components/button";
import querystring from 'querystring'
import { client_id } from "../private/spotify";
import { generateRandomString } from "../helpers/generators";

function redirectToSpotify() {
    console.log('HI')
    const state = generateRandomString(16)
    var scope = 'user-read-private user-read-email';
    window.location.href='https://accounts.spotify.com/authorize?' + querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      redirect_uri: 'http://localhost:3000/',
      state: state,
      scope:scope
    });

}

export function Login() {
    return (
        <div>
            <Button onClick={redirectToSpotify}> HELLO WORLD</Button>
        </div>
    )
}