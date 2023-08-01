import { useState } from "react";

import addArtist from "../data/addArtist";

function SubmitArtist() {

    const [newArtistId, setNewArtistId] = useState("");

    return (
        <div>
            <input
                value={newArtistId}
                onChange={(e) => setNewArtistId(e.target.value)}
                placeholder="Submit a new artist id"
            />

            <input
                type="submit"
                value="Submit"
                onClick={() => {
                    addArtist(newArtistId).then((response) => {
                        // send back a status message
                        let msgElement =
                            document.getElementById("submit-artist-message");
                        if (!response.ok) {
                            response.json().then((json) => {
                                msgElement.innerHTML = json.error;
                            });
                        } else {
                            msgElement.innerHTML =
                                `Successfully added artist
                                 ${newArtistId} to database`;
                        }
                    });
                }}
            />

            <div id="submit-artist-message"></div>

        </div>
    );
}

export default SubmitArtist;