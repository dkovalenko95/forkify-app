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
    console.error(`${err} 💥💥💥`);
  }
};

// Handling few event listeners with the same callback:
['hashchange', 'load'].forEach( ev => window.addEventListener(ev, controlRecipes) );
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
