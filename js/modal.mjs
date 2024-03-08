// Render the posts and replace the old ones
/**
 * //Get posts from api call and render them
 * @param {string} search optional search string
 * ```js
 *  const feedContainer = document.getElementById(`feedContainer`);
 *  const response = await getApi(postsEndpoint)
 *  const postsArray = apiResponse.data
 * ```
 */
export default class Modal {
    constructor(){
        this.modalContainer = document.getElementById('modal')
        this.modalBackground = this.modalContainer.querySelector('.modal-back-ground')
        this.modalDisplay = this.modalContainer.querySelector('.modal-display')
        this.addFunctions()
    }
    addFunctions(){
        this.modalBackground.addEventListener('click',()=>{
            window.history.pushState({}, '', 'index.html');
            this.modalContainer.classList.add('hide-modal')
        })
    }
    show(){
        this.modalContainer.classList.remove('hide-modal')
    }
    hide(){
        this.modalContainer.classList.add('hide-modal')
    }
}