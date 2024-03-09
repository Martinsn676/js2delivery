
const LocalImport = await import("./localSave.mjs");
const Local = new LocalImport.default();

/**
* Get the username of current user from LocalStorage, created during signin
* @returns Localsave username
*/
function getUserName(){
    const userName = Local.get('userName')
    return userName
}
/**
 * Get the param from Url or return false
 * @param {string} findElement string text to look for in Url
 * @returns return param or False
 */
function getUrlParam(findElement) {
  let params = new URLSearchParams(window.location.search);
  let param = params.get(findElement);
  return param ? param : false;
}
/**
* Deletes local storage and moves to /index.html
*/
function signOut(){
    localStorage.clear()
    window.location.href = '../index.html'
}

export {getUserName,getUrlParam,signOut}