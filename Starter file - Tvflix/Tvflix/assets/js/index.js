'use strict';

// Import all components and functions 
import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

/**
 * Home page section (top rated, upcoming, trending movies)
 */
const homepageSections = [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming"
    },
    {
        title: "Weekly Trending Movies",
        path: "/trending/movie/week"
    },
    {
        title: "Top Rated Movies",
        path: "/movie/top_rated"
    }
];

/**
 * Fetch all genres e.g., [ { id: 123, name: action}]
 * then change format e.g., { 123: "action" }
 */
const genreList = {
    // Create genre string from genre_id e.g., { 123, "Action", "Romance" }
    asString(genreIdList) {
        let newGenreList = [];
        for (const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]); // this === genreList;
        }
        return newGenreList.join(", ");
    }
};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
    if (genres) {
        for (const { id, name } of genres) {
            genreList[id] = name;
        }

        fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
    }
});

const heroBanner = function ({ results: movieList }) {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.setAttribute("aria-label", "popular movie");

    banner.innerHTML = `
        <div class="banner-slider"></div>
        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
    `;

    let controlItemIndex = 0;

    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");

        sliderItem.innerHTML = `
            <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" 
            loading=${index === 0 ? "eager" : "lazy"}>
            <div class="banner-content">
                <h2 class="heading">${title}</h2>
                <div class="meta-list">
                    <div class="meta-item">${release_date.split("-")[0]}</div>
                    <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                </div>
                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="banner-text">${overview}</p>
                <a href="detail.html?id=${id}" class="btn" data-movie-id="${id}">
                    <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
                    <span class="span">Watch Now</span>
                </a>
            </div>
        `;

        banner.querySelector(".banner-slider").appendChild(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);
        controlItemIndex++;

        controlItem.innerHTML = `
            <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
        `;

        banner.querySelector(".control-inner").appendChild(controlItem);
    }

    pageContent.appendChild(banner);

    addHeroSlider();

    /**
     * Fetch data for home page sections (top rated, upcoming, etc)
     */
    for (const { title, path } of homepageSections) {
        fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
    }
};

/**
 * Hero slider functionality
 */
const addHeroSlider = function() {
    const sliderItems = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control]");

    if (sliderItems.length === 0 || sliderControls.length === 0) {
        return; // Exit if there are no slider items or controls
    }

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    // Set the initial active slider item and control
    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    // Add event listeners to each slider control
    sliderControls.forEach((control, index) => {
        control.addEventListener("click", () => {
            if (lastSliderItem !== sliderItems[index]) {
                // Remove active class from the last active items
                lastSliderItem.classList.remove("active");
                lastSliderControl.classList.remove("active");

                // Add active class to the clicked control and corresponding slider item
                sliderItems[index].classList.add("active");
                control.classList.add("active");

                // Update the last active items
                lastSliderItem = sliderItems[index];
                lastSliderControl = control;
            }
        });
    });
};

/**
 * Create movie list for homepage sections
 */
const createMovieList = function ({ results: movieList }, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.setAttribute("aria-label", `${title}`);

    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">${title}</h3>
        </div>
        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;

    for (const movie of movieList) {
        const movieCard = createMovieCard(movie); // Called from movie_card.js
        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
};


search();
