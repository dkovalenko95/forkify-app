import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// App logic(ROUTER): Handles UI events and dispatches tasks to 'model' and 'view'
const controlRecipes = async function () {
  try {
    // 1) Get recipe id:
    const idRecipe = window.location.hash.slice(1);
    // console.log(idRecipe);
    if (!idRecipe) return;
    recipeView.renderSpinner();

    // 1a) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1b) Updating bookmark view
    bookmarksView.update(model.state.bookmarks);
    
    // 2) Loading recipe(async func from model.js -> return promise) -> one async func calling another async func:
    await model.loadRecipe(idRecipe);
    
    // 3) Rendering recipe:
    recipeView.render(model.state.recipe);


  } catch (err) {
    // Handling error:
    recipeView.renderError();
    console.error(err);
  }
};

// Publisher-Subsriber pattern: addHandlerSearch() - publisher, controlSearchResults() - subscriber
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);

    // 1) Get search query:
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results:
    // loadSearchResults() does not return anything, it's manipulate 'state'
    await model.loadSearchResults(query);

    // 3) Render results:
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(model.state.search.page));

    // 4) Render initial pagination btns
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err);
  }
};

// Publisher-Subsriber pattern: addHandlerCLick() - publisher, controlPagination() - subscriber
const controlPagination = function (goToPage) {
  console.log(goToPage);

  // 1) Render NEW results:
  // console.log(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination btns
  paginationView.render(model.state.search);
};

// ControlServings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); // -> difference between update() and render() is that update() will only update text and attrs in the DOM, so without having to re-render the entire view.
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

controlBookmarksRender = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Init func:
const init = function () {

  bookmarksView.addHandlerRender(controlBookmarksRender);
  
  // Publisher-Subsriber pattern(handle events in controller - listen events in view) - pattern algorithm: 
  // -> subscribe to the publisher by passing in the subscriber func as arg -> 
  // -> addHandlerRender() - publisher - code that knows when to react
  // -> controlRecipes() - subsriber - code that wants to react(code that should be executed when event happens)
  
  recipeView.addHandlerRender(controlRecipes); // -> subsrice controlRecipes() to addHandlerRender() -> two funcs connected -> controlRecipes() will be passed into addHandlerRender() when program starts by init() -> addHandlerRender() listens for events (addEventListener()), and use controlRecipes() as callback -> in other words, as soon as the publisher publishes an event the subscriber will get called
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

// IIFE init func:
// (function init () {
//   recipeView.addHandlerRender(controlRecipes);
// })();
