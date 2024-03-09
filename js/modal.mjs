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
    constructor(place){
console.log(place)
        this.modalContainer = document.getElementById(place)
        this.modalContainer.innerHTML=`
            <!-- display are of modal -->
            <div class="modal-display"></div>
            <!-- background fade -->
            <div class="modal-back-ground"></div>
            `
        this.modalBackground = this.modalContainer.querySelector('.modal-back-ground')
        this.modalDisplay = this.modalContainer.querySelector('.modal-display')
        this.addFunctions()
    }
    /**
     * add modal functions
     */
    addFunctions(){
        this.modalBackground.addEventListener('click',()=>{
            window.history.pushState({}, '', 'index.html');
            this.modalContainer.classList.add('hide-modal')
        })
    }
    /**
     * Show modal
     */
    show(){
        this.modalContainer.classList.remove('hide-modal')
    }
    /**
     * Hide modal
     */
    hide(){
        this.modalContainer.classList.add('hide-modal')
    }
}