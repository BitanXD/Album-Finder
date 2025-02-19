import React, { useEffect, useState } from 'react'
import {FormControl, InputGroup, Container, Button} from "react-bootstrap"

const App = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecretId = import.meta.env.VITE_CLIENT_SECRET;
  // console.log(clientId, clientSecretId);
  const[searchInput, setSearchInput] = useState("")
  const[accessToken, setAccessToken] = useState("")

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
      "grant_type=client_credentials&client_id=" +
      clientId +
      "&client_secret=" +
      clientSecretId,
    }
    fetch("https://accounts.spotify.com/api/token", authParams)
    .then((result) => result.json())
    .then((data) => {
      setAccessToken(data.access_token);
    });
  }, [])
  
  // async function to get the artist id on the basis of userinput
  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
    //function will return the artist id
    const artistId = await fetch("https://api.spotify.com/v1/search?q=" +searchInput + "&type=artist", artistParams)
    .then((result) => result.json())
    .then((data) => {
      return data.artists.items[0].id;
    })

    console.log("Search input:" + searchInput);
    console.log("Artist id:" + artistId);
    
  }
  return (
    <Container>
      <InputGroup>
      <FormControl
      placeholder='Search your Artist'
      type='input'
      aria-label='Search for a artist'
      onKeyDown={(event) => {
        if(event.key === "Enter") search()
      }}
      onChange={(event) => setSearchInput(event.target.value)}
      style={{
        width: "300px",
        height: "35px",
        borderWidth: "0px",
        borderStyle: "solid",
        borderRadius: "10px",
        marginRight: "10px",
        paddingLeft: "10px"
      }}
      />
      <Button>Search</Button>
      </InputGroup>
    </Container>
  )
}

export default App