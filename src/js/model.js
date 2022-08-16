import { async } from "regenerator-runtime";
import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";

// Main data obj with main recipe data:
export const state = {
  recipe: {},
};

// Main business logic + HTTP library + State: loadRecipe() make AJAX request -> loads recipe -> change 'state' obj with the main data
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
  
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    };
    console.log(state.recipe);
  } catch (err) {
    // Temp err handling:
    console.error(`${err} ⛔⛔⛔`);
    // Re-throw err:
    throw err;
  }
};
