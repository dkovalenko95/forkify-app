import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// App logic(ROUTER): Handles UI events and dispatches tasks to 'model' and 'view'
const controlRecipes = async function () {
  try {
    // Get recipe id:
    const idRecipe = window.location.hash.slice(1);
    // console.log(idRecipe);
    if (!idRecipe) return;
    recipeView.renderSpinner();

    // 1) Loading recipe(async func from model.js -> return promise) -> one async func calling another async func:
    await model.loadRecipe(idRecipe);
    
    // 2) Rendering recipe:
    recipeView.render(model.state.recipe);

  } catch (err) {
    // Handling error:
    recipeView.renderError();
  }
};

// Publisher-Subsriber pattern: addHandlerSearch() - publisher, controlSearchResults() - subscriber
const controlSearchResults = async function () {
  try {
    // 1) Get search query:
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results:
    // loadSearchResults() does not return anything, it's manipulate 'state'
    await model.loadSearchResults(query);

    // 3) Render results:
    console.log(model.state.search.results);

  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

// Init func:
const init = function () {
  

  // Publisher-Subsriber pattern(handle events in controller - listen events in view) - pattern algorithm: 
  // -> subscribe to the publisher by passing in the subscriber func as arg -> 
  // -> addHandlerRender() - publisher - code that knows when to react
  // -> controlRecipes() - subsriber - code that wants to react(code that should be executed when event happens)
  
  recipeView.addHandlerRender(controlRecipes); // -> subsrice controlRecipes() to addHandlerRender() -> two funcs connected -> controlRecipes() will be passed into addHandlerRender() when program starts by init() -> addHandlerRender() listens for events (addEventListener()), and use controlRecipes() as callback -> in other words, as soon as the publisher publishes an event the subscriber will get called

  searchView.addHandlerSearch(controlSearchResults);

};
init();

// IIFE init func:
// (function init () {
//   recipeView.addHandlerRender(controlRecipes);
// })();
