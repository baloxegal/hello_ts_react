import React, { useReducer, useEffect } from "react";
import "../App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

//https://api.themoviedb.org/3/discover/movie?api_key=###&with_genres=28
//https://api.themoviedb.org/3/movie/550?api_key=735d613c3f941460f4529affa262145e
//const MOVIE_API_URL = "http://api.kinopoisk.cf/getFilm?filmID=714888";//"https://www.omdbapi.com/?s=man&apikey=4a3b711b";

const MOVIE_API_URL = "https://www.omdbapi.com/?s=man&apikey=4a3b711b";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};


const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};



const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
    
        fetch(MOVIE_API_URL)
            .then(response => response.json())
            .then(jsonResponse => {
        
            dispatch({
                type: "SEARCH_MOVIES_SUCCESS",
                payload: jsonResponse.Search
        	});
      	});
  	}, []);

    const search = (searchValue: any) => {
    	dispatch({
      	type: "SEARCH_MOVIES_REQUEST"
    	});

        //http://api.kinopoisk.cf/getFilm?filmID=714888
        //https://api.themoviedb.org/3/discover/movie?api_key=###&with_genres=28
        //fetch(`http://api.kinopoisk.cf/getFilm?filmID=${searchValue}`)  //&apikey=4a3b711b
        fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)  //&apikey=4a3b711b
        //fetch(`https://api.themoviedb.org/3/movie/550?api_key=735d613c3f941460f4529affa262145e`)
      	.then(response => response.json())
      	.then(jsonResponse => {
        	if (jsonResponse.Response === "True") {
          	dispatch({
                type: "SEARCH_MOVIES_SUCCESS",
                payload: jsonResponse.Search
          	});
        	} else {
          	dispatch({
                type: "SEARCH_MOVIES_FAILURE",
                error: jsonResponse.Error
          	});
          }
      	});
	  };

    const { movies, errorMessage, loading } = state;

    return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movies</p>
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading... </span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie: any, index: any) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;