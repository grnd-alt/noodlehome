import logo from './logo.svg';
import './App.css';
import { client_id, client_secret } from './private/spotify';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect } from 'react';

async function getAccessTokenFromGQL(clientAuthToken) {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
  })

  const result = await client.query({
    query: gql`
    query getSpotifyToken($clientAuthToken: String!
    ) {
      getSpotifyToken(clientAuthToken: $clientAuthToken)
    }`,
    variables:{clientAuthToken:clientAuthToken}
  })
  return result['data']['getSpotifyToken']
}

async function getPlayerState(code) {
  const resp = await fetch('https://api.spotify.com/v1/me/player',{
    method: 'GET',
    headers: {
      "Authorization": "Bearer "+code
    }
  })
  return await resp.json();
}

function App() {
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('code')
  let token;
  useEffect(() => {
    if(code) {
      token = getAccessTokenFromGQL(code);
    }
  })
  console.log(token);
  // getPlayerState(code).then((value) => {
  //   console.log(value)
  //   return value
  // })
  return (
    <div className="App">
      {code}
    </div>
  );
}

export default App;
