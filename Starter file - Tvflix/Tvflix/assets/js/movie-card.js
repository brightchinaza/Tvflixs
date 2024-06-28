// 'use strict';

// import { imageBaseURL } from "./api.js";

// /***
//  * movie card 
//  */
// export function createMovieCard(movie) {
//     const {
//         poster_path,
//         title,
//         vote_average,
//         release_date,
//         id
//     } = movie;

//     const card = document.createElement("div");
//     card.classList.add("movie-card");

//     card.innerHTML = `
//         <figure class="poster-box card-banner">
//             <img src="${imageBaseURL}w342${poster_path}" alt="${title}"
//                 class="img-cover" loading="lazy">
//         </figure>

//         <h4 class="title">${title}</h4>

//         <div class="meta-list">
//             <div class="meta-item">
//                 <img src="./assets/images/star.png" height="24" width="24" loading="lazy" alt="rating">
//                 <span class="span">${vote_average.toFixed(1)}</span>
//             </div>
//             <div class="card-badge">${release_date.split("-")[0]}</div>
//         </div>

//         <a href="#" class="card-btn" data-movie-id="${id}" title="${title}"></a>
//     `;

//     // Add event listener to the card button to store movie ID in local storage
//     const cardBtn = card.querySelector('.card-btn');
//     cardBtn.addEventListener('click', function(event) {
//         event.preventDefault();
//         const newMovieId = this.getAttribute('data-movie-id');
//         window.localStorage.setItem("movieId", String(newMovieId));
//         window.location.reload(); // Reload the page with the new movieId
//     });

//     return card;
// }



















// 'use strict';

// import { imageBaseURL } from "./api.js";

// /***
//  * movie card 
//  */
// export function createMovieCard(movie) {
//   const {
//     poster_path,
//     title,
//     vote_average,
//     release_date,
//     id
//   } = movie;

//   const card = document.createElement("div");
//   card.classList.add("movie-card");

//   card.innerHTML = `
//     <figure class="poster-box card-banner">
//       <img src="${imageBaseURL}w342${poster_path}" alt="${title}"
//           class="img-cover" loading="lazy">
//     </figure>

//     <h4 class="title">${title}</h4>

//     <div class="meta-list">
//       <div class="meta-item">
//         <img src="./assets/images/star.png" height="24" width="24" loading="lazy" alt="rating">
//         <span class="span">${vote_average.toFixed(1)}</span>
//       </div>
//       <div class="card-badge">${release_date.split("-")[0]}</div>
//     </div>

//     <a href="detail.html?id=${id}" class="card-btn" title="${title}"></a>
//   `;

//   // Add event listener to the card button to store movie ID in local storage
//   const cardBtn = card.querySelector('.card-btn');
//   cardBtn.addEventListener('click', function(event) {
//     event.preventDefault();
//     window.localStorage.setItem("movieId", id);
//     window.location.href = `detail.html?id=${id}`;
//   });

//   return card;
// }

'use strict';

import { imageBaseURL } from "./api.js";

/***
 * movie card 
 */
export function createMovieCard(movie) {
  const {
    poster_path,
    title,
    vote_average,
    release_date,
    id
  } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title}"
          class="img-cover" loading="lazy">
    </figure>

    <h4 class="title">${title}</h4>

    <div class="meta-list">
      <div class="meta-item">
        <img src="./assets/images/star.png" height="24" width="24" loading="lazy" alt="rating">
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>

    <a href="detail.html?id=${id}" class="card-btn" title="${title}"></a>
  `;

  // Add event listener to the card button to store movie ID in local storage
  const cardBtn = card.querySelector('.card-btn');
  cardBtn.addEventListener('click', function(event) {
    event.preventDefault();
    window.localStorage.setItem("movieId", id);
    window.location.href = `detail.html?id=${id}`;
  });

  return card;
}






