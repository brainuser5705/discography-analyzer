require("dotenv").config({ path: "./config.env" });
const https = require('https');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

function getAccessToken(){

    return new Promise((resolve, reject) => {
        // URL encodes the request bdoy for application/x-www-form-urlencoded
        let form = encodeURI('grant_type') + '=' + encodeURI('client_credentials');

        // Defines the API endpoint, HTTP method and sets header
        let options = {
            host: 'accounts.spotify.com',
            path: '/api/token',
            method: 'POST',
            auth: `${CLIENT_ID}:${CLIENT_SECRET}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        // creates the request with options and callback function
        let req = https.request(options, (res) => {

            res.setEncoding('utf8');

            let rawData = '';

            // listener/handler to consume the data from response
            res.on('data', (chunk) => { 
                rawData += chunk;
            });

            // what to do when there is no more data to consume
            res.on('end', () => {
                try{
                    let data = JSON.parse(rawData);
                    resolve(data.access_token);
                }catch(e){
                    reject(e.message);
                }
            });

        });

        req.on('error', (error) => {
           reject(`Request failed with error: ${error.message}`)
        })

        req.write(form); // puts data in request body
        req.end();  // sends off request
    })
    

}


function getData(accessToken, endpoint, id){

    return new Promise((resolve, reject) => {
        let options = {
            host: 'api.spotify.com',
            path: `/v1/${endpoint}/${id}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        }
    
        https.get(options, (res) => {

            res.setEncoding('utf8');
    
            let rawData = '';
    
            // listener/handler to consume the data from response
            res.on('data', (chunk) => { 
                rawData += chunk;
            });
    
            // what to do when there is no more data to consume
            res.on('end', () => {
                try{
                    resolve(JSON.parse(rawData));
                }catch(e){
                    reject(e.message);
                }
            });
    
        }).on('error', (error) => {
            console.error(error.message);
            reject(`GET request to ${endpoint} failed: ${error.message}`);
        });
    });
    
}

module.exports = { getAccessToken, getData }