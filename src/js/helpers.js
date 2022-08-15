import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

// Timeout:
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Get json:
export const getJSON = async function (url) {
  try {
    // Race to handle the delay:
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    
    return data; // -> 'data' resolve value of the promise from getJSON()

  } catch (err) {
    // Temp err handling -> 
    // Re-throw err, so it apppear in model.js ->
    // So we propagated err down(to loadRecipe() in model.js) from one async func to the other by re-throwing err here in this 'catch' block:
    throw err;
    // console.log(err);
  }
};
