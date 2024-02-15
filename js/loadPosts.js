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

const postsObject = {
    'user':"",
    'settings':{
        'endApi':'_author=true'
    },
    'container':"",
    'modal':"",
    'modalBackground':"",
    setUp(){
        this.container=document.getElementById(`feedContainer`)
        this.user=getUserName()
        this.modalContainer = document.getElementById('modal')
        this.modalBackground = this.modalContainer.querySelector('.modal-back-ground')
        this.modalDisplay = this.modalContainer.querySelector('.modal-display')
        this.modalBackground.addEventListener('click',()=>{
            this.modalContainer.classList.add('hide-modal')
        })
    },
    async getApi(search){
        const response = await apiCall(search, searchEndpoint, getApi, '_author=true');
        const json = await response.json();
        return json.data
    },
    async updatePosts(search){
        const postsArray = await this.getApi(search)
        const html = await this.createHtml(postsArray)
        feedContainer.innerHTML = html
        // this.container.insertAdjacentHTML("beforeend", html);
        this.addFunctions(postsArray)
    },
    async createHtml(postsArray){
        let html = ""
        postsArray.forEach((post) => {
            let editText = "";
            let tagHtml = "";
            let editButton = "<div></div>";
            const { created, updated, media, tags, author,id } = post;
            if (created != updated) {
                editText = ' (edited)';
            }
            if (tags) {
                tags.forEach(tag => {
                    tagHtml += `<li>${tag}</li>`;
                });
            }
            if (this.user === author.name) {
                editButton = `                   
                    <button id="edit-button-${id}" class="edit-button icon-button"><i class="bi bi-pencil-fill"></i></button>
                `
            }
            const url = media ? media.url : '';
            html += this.feedTemplate(post,editText,tagHtml,url,editButton)
        });
        return html
        
    },
    addFunctions(postsArray){
        postsArray.forEach((post) => {
            const { id,media,author } = post;
            const postContainer = document.getElementById(`post-${id}`);
            if(media){
                postContainer.querySelector('.media-post').addEventListener("click", () => this.displayPost(post));
            }else{
                postContainer.classList.add('hide')
            }
        });
    },
    async displayPost(post){
        const newHtml = await postsObject.createHtml([post])
        this.modalDisplay.innerHTML=newHtml
        this.modalContainer.classList.remove('hide-modal')
        if (this.user === post.author.name) {
            const editButton = this.modalDisplay.querySelector('.edit-button')         
            editButton.addEventListener("click", () =>{
                ditThis(post)
                modalContainer.classList.add('hide-modal')
            });
        }
    },
    async deleteThis(id){
        id = id ? id : Number(formObject.container.querySelector('#postID').value)
        console.log(id)
        const response = await apiCall("",postsEndpoint,deleteApi,id)
        if(response.ok){
            addPosts()
            formObject.clearForm()
        }else{
            getErrorJson(response,'delete post')
        }
    },
    feedTemplate(post,editText,tagHtml,url,editbutton){
        const { created, id, title, body } = post;
        return `
            <div id="post-${id}" class="media-post-container">
                <div class="media-post">
                    <div class="text-box">
                        <h3 class="title">${title}</h3>
                        <p class="fs-6 text">${body}</p>
                        <span>${cleanDate(created)}${editText}</span>
                    </div>
                    <div class="blur"></div>
                    <div class="image-container flex-column align">
                        <img class="img" src='${url}'>
                        ${editbutton}
                    </div>
                    <ul class="tags-container list-unstyled">${tagHtml}</ul>
                </div>
            </div>
        `
    
    }
}
postsObject.setUp()
postsObject.updatePosts()

function editThis(post) {
    const { media, id, title, body, tags } = post

    const imageUrlInput = formObject.container.querySelector('#imageUrlInput');
    const titleInput = formObject.container.querySelector('#titleInput');
    const textInput = formObject.container.querySelector('#textInput');
    const postID = formObject.container.querySelector('#postID')

    imageUrlInput.value = media.url;
    titleInput.value = title;
    textInput.value = body;
    postID.value = id;

    tagsObject.tags=tags
    tagsObject.update()
    formObject.activateForm('edit')
    formObject.updateImagePreview()
}


