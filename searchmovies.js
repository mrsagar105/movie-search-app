// select class products from dom
let movies = document.querySelector(".movies");

// Function: to Create elements and append to the HTML page
async function showMovies(el) {
  // create movie
  var movie = document.createElement("div");
  movie.setAttribute("class", "movie");

  // img_container
  var imgContainer = document.createElement("div");
  imgContainer.setAttribute("class", "img_container");

  var img = document.createElement("img");
  if (el.Poster == "N/A") {
    img.src = "images/img_not_found.png";
  } else {
    img.src = el.Poster;
  }

  imgContainer.append(img);

  // movie_content
  var movieContent = document.createElement("div");
  movieContent.setAttribute("class", "movie_content");

  var contentTop = document.createElement("div");
  contentTop.setAttribute("class", "content_top");

  var movieName = document.createElement("div");
  movieName.setAttribute("class", "movie_name");
  movieName.innerHTML = el.Title;

  var movieRating = document.createElement("div");
  movieRating.setAttribute("class", "movie_rating");

  let imdbID = el.imdbID;
  let titleResponse = await fetch(
    `http://www.omdbapi.com/?i=${imdbID}&apikey=aa8e1992`
  );
  let data = await titleResponse.json();
  movieRating.innerHTML = "IMDB rating: " + data.imdbRating;

  var movieYear = document.createElement("div");
  movieYear.setAttribute("class", "movie_year");
  movieYear.innerHTML = "Release Date: " + el.Year;

  var movieButton = document.createElement("div");
  movieButton.setAttribute("class", "movie_button");
  movieButton.textContent = "View details";

  movieButton.addEventListener("click", function () {
    addToCart(el);
  });

  var recommended = document.createElement("div");
  recommended.setAttribute("class", "recommended");
  recommended.innerHTML = "Recommended";

  contentTop.append(movieName, movieRating, movieYear);

  if (data.imdbRating > 8.5) {
    movieContent.append(contentTop, movieButton, recommended);
  } else {
    movieContent.append(contentTop, movieButton);
  }

  // append to movie
  movie.append(imgContainer, movieContent);

  // append to movies
  movies.append(movie);
}

// Function: to get all the movies from local storage and display the data in HTML page
async function fetchData() {
  // set movies innerHTML to null
  movies.innerHTML = null;

  let input = document.querySelector(".search_input").value;

  let response = await fetch(
    `http://www.omdbapi.com/?s=${input}&apikey=aa8e1992`
  );
  let data = await response.json();
  var allmovies = data.Search;
  if (allmovies == null) {
    // hide button and p
    viewmoreButton.setAttribute("class", "view_more_movies hide");
    p.setAttribute("class", "didnt_find hide");

    movies.innerHTML = `
    <div class="no_result_error">
    <img class="warning_image" src="images/warning.png">
    <p class="error_message">Sorry, we couldn't find any results. Please type atleast 3 letters.</p>
    </div>
    `;
  }

  allmovies.forEach(function (movie) {
    showMovies(movie);
  });
}

// Function: for view more button
var page = 2;
async function buttonfetchData() {
  let input = document.querySelector(".search_input").value;

  let response = await fetch(
    `http://www.omdbapi.com/?s=${input}&page=${page}&apikey=aa8e1992`
  );
  let data = await response.json();
  var allmovies = data.Search;

  allmovies.forEach(function (movie) {
    showMovies(movie);
  });

  page++;
}

// add hidden view more movies button
let container = document.querySelector(".container");
var viewmoreButton = document.createElement("button");
viewmoreButton.setAttribute("onclick", "buttonfetchData()");
viewmoreButton.setAttribute("class", "view_more_movies");
viewmoreButton.textContent = "View more movies";

var p = document.createElement("p");
p.setAttribute("class", "didnt_find");
p.textContent = "Didn't find what you are looking for?";

container.append(p, viewmoreButton);

// on enter press input
var searchinput = document.querySelector(".search_input");

searchinput.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    // Run function fetchData
    fetchData();

    // display button

    viewmoreButton.setAttribute("class", "view_more_movies show");
    p.setAttribute("class", "didnt_find show");
  }
});
