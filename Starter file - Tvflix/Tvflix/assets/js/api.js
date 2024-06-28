'use strict';

const api_key = '093fa1966b205fa53e3720ad32635bdd';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

/**
 * Fetch data from server using the 'url' and passes 
 * the result in JSON format to a 'callback' function 
 * along with an optional parameter if it has 'optionalParam'.
 */
const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data, optionalParam))
        .catch(error => console.error('Error fetching data:', error));
}

export { imageBaseURL, api_key, fetchDataFromServer };
