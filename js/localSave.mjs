export default class Local{
  /**
  * Save to local storage with name.
  * @param {string} name The name of the item to be added to local storage.
  * @param {string} content The string/numebr to be saved
  * ```js
    localStorage.setItem(name, content);
  * ```
  */
  save(name,content){
    localStorage.setItem(name, content);
  }

  /**
  * Delete from local storage with name.
  * @param {string} name The name of the item to be removed from local storage.
  * ```js
  * localStorage.removeItem(name)
  * ```
  */
  delete(name){
    localStorage.removeItem(name)
  }
  /**
  * Get local storage with name.
  * @param {string} name The name of the item to be retrieved from local storage.
  * ```js
    localStorage.setItem(name, content);
  * ```
  */
  get(name){
      const retrieved = localStorage.getItem(name);
      return retrieved
  }

}