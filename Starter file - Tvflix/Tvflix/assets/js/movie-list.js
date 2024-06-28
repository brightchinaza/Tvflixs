

'use strict';

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

// Collect genre name & URL parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPages = 0;

// Function to fetch and display movies
const fetchAndDisplayMovies = function (page) {
    fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${page}&${urlParam}`, function ({ results: movieList, total_pages }) {
        totalPages = total_pages;

        // Update document title
        document.title = `${genreName} Movies - Tvflix`;

        let movieListElem = document.querySelector(".movie-list.genre-list");

        // Create the section element if it doesn't exist
        if (!movieListElem) {
            movieListElem = document.createElement("section");
            movieListElem.classList.add("movie-list", "genre-list");
            movieListElem.setAttribute("aria-label", `${genreName} Movies`);

            movieListElem.innerHTML = `
                <div class="title-wrapper">
                    <h1 class="heading">All ${genreName} Movies</h1>
                </div>
                <div class="grid-list"></div>
                <button class="btn load-more" id="load-more-button" load-more>Load More</button>
            `;

            pageContent.appendChild(movieListElem);

            // Add event listener for the "Load More" button
            document.getElementById("load-more-button").addEventListener("click", () => {
                currentPage++;
                fetchAndDisplayMovies(currentPage);
            });
        }

        // Add movie cards based on fetched items
        for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            movieListElem.querySelector(".grid-list").appendChild(movieCard);
        }

        // Hide the "Load More" button if there are no more pages to load
        if (currentPage >= totalPages) {
            document.getElementById("load-more-button").style.display = 'none';
        }

        /***
         * Load more button functionality
         */
        document.querySelector("[load-more]").addEventListener("click", function() {
            if (currentPage >= totalPages) {
                this.style.display = "none"; // this === loading-btn
                return;
            }
            currentPage++;
            this.classList.add("loading"); // this === loading-btn

            fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`, ({ results: movieList }) => {
                this.classList.remove("loading"); // this === loading-btn

                for (const movie of movieList) {
                    const movieCard = createMovieCard(movie);
                    movieListElem.querySelector(".grid-list").appendChild(movieCard);
                }
            });
        });
    });
};

// Fetch initial movies
fetchAndDisplayMovies(currentPage);

search();