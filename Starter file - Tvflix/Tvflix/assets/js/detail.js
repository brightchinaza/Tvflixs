



'use strict';

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
// import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");

sidebar();

// Function to create movie cards
const createMovieCard = function (movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");
  movieCard.innerHTML = `
    <figure class="poster-box">
      <img src="${imageBaseURL}w342${movie.poster_path}" alt="${movie.title} poster" class="img-cover">
    </figure>
    <h4>${movie.title}</h4>
  `;
  movieCard.addEventListener('click', () => {
    window.location.href = `?id=${movie.id}`; // Redirect to the movie details on the same page
  });
  return movieCard;
};

// Function to get genres list
const getGenres = function (genreList) {
  const newGenreList = [];
  for (const { name } of genreList) newGenreList.push(name);
  return newGenreList.join(", ");
};

// Function to get cast list
const getCasts = function (castList) {
  const newCastList = [];
  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

// Function to get directors list
const getDirection = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");
  const directorList = [];
  for (const { name } of directors) directorList.push(name);
  return directorList.join(", ");
};

// Function to filter videos
const filterVideos = function (videoList) {
  return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
};

// Function to display movie detail
const displayMovieDetail = function (movie) {
  const {
    backdrop_path,
    poster_path,
    title,
    release_date,
    runtime,
    vote_average,
    releases: { countries },
    genres,
    overview,
    casts: { cast, crew },
    videos: { results: videos }
  } = movie;

  const certification = countries.find(country => country.iso_3166_1 === 'US')?.certification || 'NR';

  document.title = `${title} - Tvflix`;

  const movieDetail = document.createElement('div');
  movieDetail.classList.add("movie-detail");

  movieDetail.innerHTML = `
    <div class="backdrop-image" style="background-image: url('${imageBaseURL}w1280${backdrop_path || poster_path}');"></div>
    <figure class="poster-box movie-poster">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover">
    </figure>
    <div class="detail-box">
      <div class="detail-content">
        <h1 class="heading">${title}</h1>
        <div class="meta-list">
          <div class="meta-item">
            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>
          <div class="separator"></div>
          <div class="meta-item">${runtime}m</div>
          <div class="separator"></div>
          <div class="meta-item">${release_date.split("-")[0]}</div>
          <div class="meta-item card-badge">${certification}</div>
        </div>
        <p class="genre">${getGenres(genres)}</p>
        <p class="overview">${overview}</p>
        <ul class="detail-list">
          <div class="list-item">
            <p class="list-name">Starring</p>
            <p>${getCasts(cast)}</p>
          </div>
          <div class="list-item">
            <p class="list-name">Directed By</p>
            <p>${getDirection(crew)}</p>
          </div>
        </ul>
      </div>
      <div class="title-wrapper">
        <h3 class="title-large">Trailers and Clips</h3>
      </div>
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    </div>
  `;

  for (const { key, name } of filterVideos(videos)) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");
    videoCard.innerHTML = `
      <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" 
        frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
    `;
    movieDetail.querySelector(".slider-inner").appendChild(videoCard);
  }

  pageContent.innerHTML = ''; // Clear previous content
  pageContent.appendChild(movieDetail); // Add movie detail to the page
};

// Function to fetch movie details
const getMovieDetail = function (movieId) {
  fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
    function (movie) {
      displayMovieDetail(movie);
      addSuggestedMovies(movieId); // Fetch and display suggested movies after displaying the movie detail
    }
  );
};

// Function to fetch suggested movies and add hover effect
const addSuggestedMovies = function (movieId) {
  fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
    function ({ results: movieList }) {
      const movieListElem = document.createElement("section");
      movieListElem.classList.add("movie-list");
      movieListElem.setAttribute("aria-label", "You may Also Like");

      movieListElem.innerHTML = `
          <div class="title-wrapper">
              <h3 class="title-large">You may Also Like</h3>
          </div>
          <div class="slider-list">
              <div class="slider-inner"></div>
          </div>
      `;

      for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
      }

      pageContent.appendChild(movieListElem);

      // Add hover effect to suggested movies
      movieListElem.querySelectorAll('.movie-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('mouseenter', () => {
        });
        card.addEventListener('mouseleave', () => {
          card.style.backgroundColor = ''; // Revert background color on mouse leave
        });
      });
    }
  );
};

// Fetch initial movie details based on movieId in localStorage
const movieId = new URLSearchParams(window.location.search).get("id") || window.localStorage.getItem("movieId");
if (movieId) {
  getMovieDetail(movieId);
}

search();
