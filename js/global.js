/**
 * Save to local storage with name.
 * @param {string} name The name of the item to be added to local storage.
 * @param {string} content The string/numebr to be saved
 * ```js
  localStorage.setItem(name, content);
 * ```
 */
function saveLocal(name,content){
  localStorage.setItem(name, content);
}

/**
 * Delete from local storage with name.
 * @param {string} name The name of the item to be removed from local storage.
 * ```js
 * localStorage.removeItem(name)
 * ```
 */
function deleteLocal(name){
  localStorage.removeItem(name)
}

/**
 * Get local storage with name.
 * @param {string} name The name of the item to be retrieved from local storage.
 * ```js
  localStorage.setItem(name, content);
 * ```
 */
function getLocal(name){
    const retrieved = localStorage.getItem(name);
    return retrieved
}
function cleanDate (dateString){
    const date = new Date(dateString);

    // Extract individual date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1
    const year = date.getFullYear() % 100; // Get last two digits of the year

    // Format the date components as 'DD.MM.YY'
    const formattedDate = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
    return formattedDate
}
/**
 * 
 * @returns Localsave username
 */
function getUserName(){
    const userName = getLocal('userName')
    return userName
}
/**
 * Deletes local storage and moves to /index.html
 */
function signOut(){
    localStorage.clear()
    window.location.href = '../index.html'
}
