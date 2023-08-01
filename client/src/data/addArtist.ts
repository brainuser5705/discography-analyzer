function addArtist(newArtistId : string){
    return fetch(process.env.REACT_APP_API_URI + "artist/add", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(
            {"artistId": newArtistId}
        )
    });
}

export default addArtist;