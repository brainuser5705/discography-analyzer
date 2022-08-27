// low level spotify requests

require("dotenv").config({ path: "./config.env" });
const https = require('https');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

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


// generic spotify get request helper function
function getRequest(accessToken, url){

    return new Promise((resolve, reject) => {

        let options = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

    
        https.get(url, options, (res) => {

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
            // this might not even run
            reject(`GET request to ${endpoint} failed: ${error.message}`);
        });
    });
    
}

// get all `item` property data with pagination
async function getItemData(accessToken, endpoint, ...queryParams){ // using rest operator for the query parameters

    // if nextPath isn't provided, then specify the API endpoint
    let finalUrl = `${SPOTIFY_API_URL}/${endpoint}`;
    
    // add the query parameters to the path, if there are ones
    if (Array.isArray(queryParams)){
        finalUrl += `?${queryParams.join('&')}`;
    }

    try{

        let fullData = [];

        // get the first page
        let data = await getRequest(accessToken, finalUrl);
        fullData.push(...data.items); // spread operator to push each individual object
        
        // for further pages, request with provided next url
        // if the next property didn't exist, it would be undefined
        while(data.next){
            data = await getRequest(accessToken, data.next);
            fullData.push(...data.items);
        }

        return fullData;

    }catch(error){
        console.error(`Error occured: ${error.message}`);
    }

}

// get all properties from data
async function getFullData(accessToken, endpoint, ...queryParams){ // using rest operator for the query parameters

    // if nextPath isn't provided, then specify the API endpoint
    let finalUrl = `${SPOTIFY_API_URL}/${endpoint}`;
    
    // add the query parameters to the path, if there are ones
    if (Array.isArray(queryParams)){
        finalUrl += `?${queryParams.join('&')}`;
    }

    try{

        return await getRequest(accessToken, finalUrl);

    }catch(error){
        console.error(`Error occured: ${error.message}`);
    }

}

module.exports = { getAccessToken, getFullData, getItemData }