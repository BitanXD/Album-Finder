import { useEffect, useState } from "react";
import { FormControl, InputGroup, Container, Button, Row, Card } from "react-bootstrap";
import "./App.css";

const App = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecretId = import.meta.env.VITE_CLIENT_SECRET;
  // console.log(clientId, clientSecretId);
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

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
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  // async function to get the artist id on the basis of userinput
  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    //function will return the artist id
    const artistId = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("Search input:" + searchInput);
    console.log("Artist id:" + artistId);

    //function to fetch artist albums
    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistId +
        "/albums?include_group=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  return (
    <>
    <Container>
      <InputGroup>
        <FormControl
          placeholder="Search your Artist"
          type="input"
          aria-label="Search for a artist"
          onKeyDown={(event) => {
            if (event.key === "Enter") search();
          }}
          onChange={(event) => setSearchInput(event.target.value)}
          style={{
            width: "300px",
            height: "35px",
            borderWidth: "0px",
            borderStyle: "solid",
            borderRadius: "10px",
            marginRight: "10px",
            paddingLeft: "10px",
          }}
        />
        <Button onClick={search}>Search</Button>
      </InputGroup>
    </Container>

    <Container>
        <Row style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          alignContent: "center",
        }}>
          {
            albums.map((album) => {
              return (
                <Card key={album.id}
                style={{
                  backgroundColor: "white",
                  margin: "10px",
                  borderRadius: "5px",
                  marginBottom: "30px"
                }}>
                  <Card.Img 
                  width={200}
                  src={album.images[0].url}
                  style={{
                    borderRadius: "4%"
                  }}/>
                  <Card.Body>
                    <Card.Title
                    style={{
                      whiteSpace: "wrap",
                      fontWeight: "bold",
                      maxWidth: "200px",
                      fontSize: "18px",
                      marginTop: "10px",
                      color: "black",
                    }}>
                      {album.name}
                    </Card.Title>
                    <Card.Text 
                    style={{
                      color: "black",
                    }}>
                      Release Date: <br /> {album.release_date}
                    </Card.Text>
                    <Button 
                    href={album.external_urls.spotify}
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                    >
                      Album Link
                    </Button>
                  </Card.Body>
                </Card>
              )
            })
          }
        </Row>
      </Container>
    </>
  );
};

export default App;
