
import { api } from "./apiCalls.mjs";

const tagImport = await import("./tags.mjs");
const tagsObject = new tagImport.default();

export default class PostForm {
    constructor(){
        this.container = document.getElementById('post-form')
        this.testname = 'Dolly'
    }
    activateForm(type){
        if(type==='edit'){
            this.container.classList.add('edit-mode')
        }else if(type==='post'){
            this.container.classList.remove('edit-mode')
        }
    }
    clearForm(){
        const formContainer = document.querySelector('#post-form')
        const inputs = formContainer.querySelectorAll('.clearable')
        inputs.forEach(input => {
            input.value=""
        });
        tagsObject.tags=[]
        tagsObject.update()
        this.clearWarning()
        this.activateForm('post')
        this.updateImagePreview('')
        
    }
    clearWarning(){
        const errorMessageText = this.container.querySelector('#errorMessageText')
        errorMessageText.classList.add('d-none')
    }
    updateImagePreview(event){

        const value = document.querySelector('#sideMenu #imageUrlInput').value
        const url = value ? value :""
        const imagePreview = document.querySelector('#sideMenu #imagePreview')
        const dummyImage = new Image();
        if(url===""){
            imagePreview.classList.add('d-none')
        }else{
            imagePreview.classList.remove('d-none')
            imagePreview.src=url
            dummyImage.onload = function(){
                imagePreview.src=url
            }
            dummyImage.onerror = function(){
                // stolen image
                imagePreview.src = 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
            }
        }
    }
    editThis(post) {
        const { media, id, title, body, tags } = post
        this.container = document.getElementById('post-form')     
        const imageUrlInput = this.container.querySelector('#imageUrlInput');
        const titleInput = this.container.querySelector('#titleInput');
        const textInput = this.container.querySelector('#textInput');
        const postID = this.container.querySelector('#postID')

        imageUrlInput.value = media.url;
        titleInput.value = title;
        textInput.value = body;
        postID.value = id;

        tagsObject.update(tags)
        this.activateForm('edit')
        this.updateImagePreview()
        const imagePreview = document.querySelector('#sideMenu #imagePreview')
        imagePreview.scrollIntoView({ behavior: 'smooth' });
    }
    templateFunctions(){
        this.container.querySelector('#cancel-button').addEventListener('click',()=>{
            event.preventDefault()
            this.clearForm()
        })
        this.container.querySelector('#delete-button').addEventListener("click", () => postsObject.deletePost());
    }
    postTemplate(){return `
        
        <input 
            type="text" 
            class="d-none clearable" 
            id="postID" 
            name="postID" 
            value=""
        />

        <label for="imageUrl" class="form-label">Image url</label>
        <input required 
            type="text" 
            class="form-control clearable" 
            id="imageUrlInput" 
            name="imageUrl" 
            value=""
        />

        <label for="title" class="form-label">Title</label>
        <input required 
            type="text" 
            class="form-control clearable" 
            id="titleInput" 
            name="title" 
            value=""
        />

        <label for="text" class="form-label">Text</label>
        <textarea 
            id="textInput" 
            name="text" 
            class="mb-2 
            form-control clearable border-primary" 
            rows="2" 
            placeholder="Description"
        ></textarea>
        <div id="textAreaCount">
        <div id="tags-input-group" class="input-group">
            <input type="text" class="clearable" id="tagInput" placeholder="Add tags" aria-label="Add tags" aria-describedby="add-tags">
            <button id="add-tags" class="add-tags" type="button">Add</button>
        </div>

        <ul class="tags-list list-unstyled col-12"></ul>
        <div class="buttons col-12 row">
            <div class="button-container only-post-mode col-6">
                <button type="submit" class="btn btn-primary">Post</button>
            </div>
            <div class="button-container only-edit-mode col-6">
                <button type="submit" class="btn btn-primary">Edit post</button>
            </div>
            <div class="button-container only-edit-mode col-6">
                <button id="delete-button" type="button" class="btn btn-primary" class="btn btn-primary">Delete</button>
            </div>
            <div class="button-container only-edit-mode col-6">
                <button id="cancel-button" type="button" class="btn btn-primary" class="btn btn-primary">Cancel</button>
            </div>

            <div id="errorMessageText" class="error-message alert alert-danger d-none text-center">
            </div>
        </div>
    `
    }
    async submitPostForm(event) {
        let testMode = false;
        event.preventDefault();
        const formTarget = event.target;

        if (formTarget.checkValidity()) {

            //Post releated inputs
            const titleInput = formTarget.querySelector('#titleInput');
            const title = titleInput ? titleInput.value : false;

            const bodyInput = formTarget.querySelector('#textInput');
            const body = bodyInput ? bodyInput.value : false;

            const idInput = formTarget.querySelector('#postID');
            const id = idInput ? Number(idInput.value) : false;

            const imageUrlInput = formTarget.querySelector('#imageUrlInput');
            const imageUrl = imageUrlInput ? imageUrlInput.value : false;
            const imageAlt = imageUrlInput ? 'User uploaded post image' : false;

            if(testMode){console.log("title:", title, "body:", body, "imageUrl:","id",id, "image",imageUrl);}
            this.clearWarning()

            let data = {}
            let errorMessage = ""

            // is valid post
            if(body){
                data.title=title
                data.body=body
                data.tags=tagsObject.tags
                data.media={
                    'url':imageUrl,
                    'alt':imageAlt,
                }
            }
            if(formTarget.classList.contains('comment')){
                const response = await api.call(data,api.postsEndpoint,api.postApi,`/${id}/comment`)
                if(!response.ok){
                    errorMessage=await api.getErrorJson(response,'comment post')
                }
            }else if(formTarget.classList.contains('edit-mode')){
                const response = await api.call(data,api.postsEndpoint,api.putApi,"/"+id)
                if(response.ok){
                    this.updatePosts()
                    this.clearForm()
                }else{
                    errorMessage=await api.getErrorJson(response,'edit post')
                }
            }else{
                const response = await api.call(data,api.postsEndpoint,api.postApi)
                if(response.ok){
                    this.updatePosts()
                    this.clearForm()
                }else{
                    errorMessage=await api.getErrorJson(response,'create post')
                }
            }
            if(errorMessage!=""){
                errorMessageText.innerText=errorMessage;
                errorMessageText.classList.remove('d-none')
            }
        }else{
            if(testMode){console.log("failed validation")}
        }
    }
}
