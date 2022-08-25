import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

// Main data obj with main recipe data:
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    
  },
  bookmarks: [],
};

// Main business logic + HTTP library + State: loadRecipe() make AJAX request -> loads recipe -> change 'state' obj with the main data
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
  
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
    // Check bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);

  } catch (err) {
    // Temp err handling:
    console.error(`${err} ⛔⛔⛔`);
    // Re-throw err:
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {

    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });

    // Reset pagination after new query
    state.search.page = 1;

  } catch (err) {
    // Temp err handling:
    console.error(`${err} ⛔⛔⛔`);
    // Re-throw err:
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  
  // Return part of results for pagination:
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  // Update servings in the state
  state.recipe.servings = newServings;
};

// Local storage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

// Bookmarks
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  console.log(recipe);

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Find actual recipe/delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  console.log(state.recipe);

  persistBookmarks();
};

const initLocalStorage = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
}
initLocalStorage();
// console.log(state.bookmarks);



// Func for debagging during developmen
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format! Please, use the correct format :)');

        const [quantity, unit, description] = ingArr;
        return {quantity: quantity ? +quantity : null, unit, description};
      });

    // Create obj for uploading
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    };

    console.log(ingredients);
    console.log(recipe);
    
  } catch(err) {
    throw err;
  }
};
