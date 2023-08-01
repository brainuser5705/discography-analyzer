import { useState } from "react";

function SubmitArtist(){

    const [newArtist, setNewArtist] = useState("");

    return (
        <div>
            <input
                value={newArtist}
                onChange={(e)=>setNewArtist(e.target.value)}
                placeholder="Submit a new artist id"
            />

            <input
                type="submit"
                value="Submit"
                onClick={()=>{
                    fetch("http://localhost:5000/artist/add", {
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "body": JSON.stringify(
                            {"artistId": newArtist}
                        )
                    }).then((response) => {
                        let msgElement = document.getElementById("submit-artist-message");
                        console.log(response);
                        if (!response.ok){
                            response.json().then((json) =>{
                                msgElement.innerHTML = json.error; 
                            });
                        }else{
                            msgElement.innerHTML = `Successfully added artist ${newArtist} to database`;
                        }
                    });
                }}
            />

            <div id="submit-artist-message">
            </div>

        </div>
    );
}

export default SubmitArtist;