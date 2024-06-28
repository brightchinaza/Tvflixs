'use strict';

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {

    // Function to add event listeners to multiple elements
    const addEventOnElements = function (elements, eventType, callback) {
        for (const elem of elements) {
            elem.addEventListener(eventType, callback);
        }
    };

    // Function to toggle sidebar visibility in mobile screen mode
    const toggleSidebar = function (sidebar) {
        const sidebarBtn = document.querySelector("[menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
        const sidebarClose = document.querySelectorAll("[menu-close]");
        const overlay = document.querySelector("[overlay]");

        addEventOnElements(sidebarTogglers, "click", function () {
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        addEventOnElements(sidebarClose, "click", function () {
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        });
    };

    // Function to fetch genres and update the sidebar
    const genreList = {};

    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
        if (genres) {
            for (const { id, name } of genres) {
                genreList[id] = name;
            }
            genreLink();
        }
    });

    // Function to create genre links in the sidebar
    const genreLink = function () {
        const sidebarInner = document.createElement("div");
        sidebarInner.classList.add("sidebar-inner");

        sidebarInner.innerHTML = `
            <div class="sidebar-list">
                <p class="title">Genre</p>
            </div>
            <div class="sidebar-list">
                <p class="title">Language</p>
                <a href="./movie-list.html" menu-close class="sidebar-link" 
                onclick='getMovieList("with_original_language=en", "English")'>English</a>

                <a href="./movie-list.html" menu-close class="sidebar-link"
                onclick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>

                <a href="./movie-list.html" menu-close class="sidebar-link"
                onclick='getMovieList("with_original_language=bn", "Bengali")'>Bengali</a>

            </div>
            <div class="sidebar-footer">
                <p class="copyright">
                    Copyright 2023 <a href="https://www.instagram.com/brightochinaza">BrightEluno</a>
                </p>
                <img src="./assets/images/tmdb-logo.svg" width="130" height="17" alt="the movie database logo">
            </div>
        `;

        for (const [genreId, genreName] of Object.entries(genreList)) {
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movie-list.html");
            link.setAttribute("menu-close", "");
            link.setAttribute("onclick", `getMovieList 
            ("with_genres=${genreId}", "${genreName}")`);
            link.textContent = genreName;

            sidebarInner.querySelector(".sidebar-list").appendChild(link);
        }

        const sidebar = document.querySelector("[sidebar]");
        if (sidebar) {
            sidebar.appendChild(sidebarInner);
            toggleSidebar(sidebar);
        }
    };
}
