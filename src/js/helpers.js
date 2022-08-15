// Get json
export const getJSON = async function (url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // -> 'data' resolve value of the promise from getJSON()
  } catch (err) {
    // Temp err handling -> 
    // Re-throw err, so it apppear in model.js ->
    // So we propagated err down from one async func to the other by re-throwing err here in this 'catch' block:
    throw err;
    // console.log(err);
  }
};
