import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// App logic(ROUTER): Handles UI events and dispatches tasks to 'model' and 'view'
const controlRecipes = async function () {
  try {
    // Get recipe id:
    const idRecipe = window.location.hash.slice(1);
    console.log(idRecipe);
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

// Init func:
const init = function () {

  // Publisher-Subsriber pattern(handle events in controller - listen events in view) - pattern algorithm: 
  // -> subscribe to the publisher by passing in the subscriber func as arg -> 
  // -> addHandlerRender() - publisher - code that knows when to react
  // -> controlRecipes() - subsriber - code that wants to react(code that should be executed when event happens)
  
  recipeView.addHandlerRender(controlRecipes); // -> subsrice controlRecipes() to addHandlerRender() -> two funcs connected -> controlRecipes() will be passed into addHandlerRender() when program starts by init() -> addHandlerRender() listens for events (addEventListener()), and use controlRecipes() as callback -> in other words, as soon as the publisher publishes an event the subscriber will get called
};
init();

// IIFE init func:
(function init () {
  recipeView.addHandlerRender(controlRecipes);
})();
