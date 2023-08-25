const IMAGE_URL = "https://image.tmdb.org/t/p/original";
const API_URL = "https://api.themoviedb.org/3/movie/top_rated";
const API_KEY = "f531333d637d0c44abc85b3e74db2186";
const SEARCH_API_URL = "https://api.themoviedb.org/3/search/movie";
const LS_KEY = "favoriteMovies";
let movies = [];
let sortedByDateFlag=1
let sortedByRatingFlag =1;
let currentPage = 1;
async function fetchMovies(page=1){
    try{
        let response = await fetch(`${API_URL}?api_key=${API_KEY}&language=en-US&page=${page}`);
        response= await response.json();
        movies = response.results;
        renderMovies(response.results);
    }
    catch(error){
        console.log(error);
    }
}
fetchMovies();

function renderMovies(newMovies){
    const moviesList = document.getElementById("movies-list");
    moviesList.innerHTML='';
    newMovies.forEach((movie)=>{
        const {poster_path , title, vote_average, vote_count } = movie;
        const listItem = document.createElement("li");
        listItem.className = "card";
        let imageSource = poster_path 
            ? `${IMAGE_URL}/${poster_path}`
            : "https://s.studiobinder.com/wp-content/uploads/2017/12/Movie-Poster-Template-Dark-with-Image.jpg?x81279";

        const imageTag = `<img class='poster' src=${imageSource} alt=${title} />`; 
        listItem.innerHTML +=imageTag;

        const titleTag = `<p class='title'>${title}</p>`;
        listItem.innerHTML+=titleTag;
        let sectionTag = `<section class="vote-favouriteIcon">
        <section class="vote">
            <p class="vote-count">Votes: ${vote_count}</p>
            <p class="vote-rating">Ratings: ${vote_average}</p>
        </section>
        <i class="fa-regular fa-heart fa-2xl favourite-icon" id=${title} ></i>
        </section>`;
        listItem.innerHTML+=sectionTag;

        const favoriteIcon = listItem.querySelector(".favourite-icon");
        favoriteIcon.addEventListener("click",(event)=>{
            const {id} = event.target;

            if(favoriteIcon.classList.contains("fa-solid")){
                removeMovieNameToLocalStorage(id);
                favoriteIcon.classList.remove("fa-solid");
            }else{
                addMovieNameToLocalStorage(id);
                favoriteIcon.classList.add("fa-solid");
            }
        });
        moviesList.appendChild(listItem);
    });   
}

const sortByDateButton = document.getElementById("sort-by-date");
function sortByDate(){
    let SortedMovies;
    if(sortedByDateFlag === 1){
        SortedMovies = movies.sort((movie1,movie2)=>{
        return new Date(movie1.release_date) - new Date(movie2.release_date);
        });
        sortedByDateFlag = -1;
        sortByDateButton.textContent="Sort by date (Latest to Oldest)";
    }else if(sortedByDateFlag === -1){
        SortedMovies = movies.sort((movie1,movie2)=>{
        return new Date(movie2.release_date) - new Date(movie1.release_date);
        });
        sortedByDateFlag = 1;
        sortByDateButton.textContent="Sort by date (Oldest to Latest)"; 
    }
    renderMovies(SortedMovies);
}
sortByDateButton.addEventListener("click",sortByDate);

const sortByRatingButton = document.getElementById("sort-by-rating");
function sortByRating(){
    let SortedMovies;
    if(sortedByRatingFlag === 1){
        SortedMovies = movies.sort((movie1,movie2)=>{
        return movie1.vote_average - movie2.vote_average;
        });
        sortedByRatingFlag = -1;
        sortByRatingButton.textContent="Sort by ratings (Most to Least)";
    }else if(sortedByRatingFlag === -1){
        SortedMovies = movies.sort((movie1,movie2)=>{
            return movie2.vote_average - movie1.vote_average;
        });
        sortedByRatingFlag = 1;
        sortByRatingButton.textContent="Sort by ratings (Least to Most)"; 
    }
    renderMovies(SortedMovies);
}
sortByRatingButton.addEventListener("click",sortByRating);

//page

const prevButton = document.getElementById("prev-button");
const pageNumberButton = document.getElementById("page-number-button");
const nextButton = document.getElementById("next-button");
prevButton.disabled = true;
prevButton.addEventListener("click",()=>{
    prevButton.disabled = false;
    
        currentPage--;
    fetchMovies(currentPage);
    pageNumberButton.textContent=`Current Page: ${currentPage}`;

});
nextButton.addEventListener("click",()=>{
    prevButton.disabled = false
;    currentPage++;
    fetchMovies(currentPage);
    pageNumberButton.textContent=`Current Page: ${currentPage}`;
    if(currentPage==570) nextButton.disabled = true;
});

const searchMovies = async (searchedMovie)=>{
    try{
       
        const response = await fetch(`${SEARCH_API_URL}?query=${searchedMovie}&api_key=${API_KEY}&language=en-US&page=1`);
        const result = await response.json();
        movies = result.results;
        renderMovies(movies);
    }catch(error){
        console.log(error);
    } 
}

const searchButton = document.querySelector(".search-btn");
const searchInput = document.getElementById("search-input");

searchButton.addEventListener("click",()=>{
    searchMovies(searchInput.value);
})

function getMovieNameFromLocalStorage(){
  const favouriteMovies = JSON.parse(localStorage.getItem(searchMovies));
  return favouriteMovies === null ? [] : favouriteMovies;
}

function addMovieNameToLocalStorage(movieName){
    const favouriteMovies = getMovieNameFromLocalStorage();
    const newFavouriteMovies = [...favouriteMovies,movieName];
    localStorage.setItem(LS_KEY,searchMovies);
}

function removeMovieNameToLocalStorage(movieName){
    const allMovies = getMovieNameFromLocalStorage();
    const newFavouriteMovies = allMovies.filter((movie)=> movie!== movieName);
    localStorage.setItem(LS_KEY,JSON.stringify(newFavouriteMovies));
}

const allTab = document.getElementById("all-tab");
const favoritesTab = document.getElementById("favourite-tab");

function switchTab(event){
    allTab.classList.remove("active-tab");
    favoritesTab.classList.remove("active-tab");

    event.target.classList.add("active-tab");


}
allTab.addEventListener("click",switchTab);
favoritesTab.addEventListener("click",switchTab);

async function getMovieByName(movieName){
    try{
        let response = await fetch(`${API_URL}?query=${movieName}&api_key=${API_KEY}&language=en-US&page=1`);
        response= await response.json();
        return response.results[0];
    
    }
    catch(error){
        console.log(error);
    }
}

function showFavorites(){
    
}
async function fetchWishListMovie(){
    const moviesList = document.getElementById("movies-list");
    moviesList.innerHTML='';
    const moviesNamesList = getMovieNameFromLocalStorage();
    moviesNamesList.forEach(async(movie)=>{
        const movieData = await getMovieByName(movie);
        showFavorites(movieData);
    })
}

function displayMovies(){
    const  pagination = document.getElementsByClassName("pagination")[0];
    const sortOpts = document.getElementsByClassName("sorting-options")[0];
    if(allTab.classList.contains("active-tab")){
        renderMovies(movies);
        pagination.computedStyleMap.opacity = "revert";
        sortOpts.computedStyleMap.opacity="revert";
    }else if(favoritesTab.classList.contains("active-tab")){
        fetchWishListMovie();
        pagination.computedStyleMap.opacity = "0";
        sortOpts.computedStyleMap.opacity="0";
        
    }
}


