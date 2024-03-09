
import { api } from "./apiCalls.mjs";
import { formHandler } from "./formHandler.mjs";
const tagImport = await import("./tags.mjs");
const tagsObject = new tagImport.default();


export default class PostForm {
    constructor(target){
        this.container=target
        target.innerHTML = this.template()
        this.errorMessageText = target.querySelector('#errorMessageText')
        this.imageInput = target.querySelector('#imageUrlInput')
        this.titleInput = target.querySelector('#titleInput');
        this.bodyInput = target.querySelector('#textInput');
        this.idInput = target.querySelector('#postID');
        this.tagsContainer = target.querySelector('.tags-list');
        this.addFunctions()
    }
    /**
     * Clear form for all inputs
     */
    clearForm(){
        const inputs = this.container.querySelectorAll('.clearable')
        inputs.forEach(input => {
            input.value=""
        });
        tagsObject.tags=[]
        tagsObject.update()
        // // this.clearWarning()
        // this.activateForm('post')
        // this.updateImagePreview('')
    }
    /**
     * Add functions to form
     */
    addFunctions(){
        this.container.querySelector('#cancel-button').addEventListener('click',(event)=>{
            event.preventDefault()
            formHandler.activateForm('post')
        })
        this.container.querySelector('#delete-button').addEventListener("click",async () =>{
            await api.call('',`${api.postsEndpoint}/${this.idInput.value}`,api.deleteApi)
            formHandler.update()
        });
        this.container.addEventListener('submit', (event) => this.submitPostForm(event));
        this.container.addTagsButton = this.container.querySelector("#add-tags")
        this.container.tagInputs = document.querySelectorAll('.tagInput')
        this.container.addTagsButton.addEventListener('click',(event)=>tagsObject.addTag(event))
        //this.imageInput.addEventListener('change',()=>PostForm.updateImagePreview(event))
    }
    /**
     * Submit post form, can be either in normal or edit-mode
     * @param {event} event 
     */
    async submitPostForm(event) {
        event.preventDefault();
        if (this.container.checkValidity()) {
            let tagsArray = []
            const title = this.titleInput ? this.titleInput.value : false;
            const body = this.bodyInput ? this.bodyInput.value : false;
            const id = this.idInput ? Number(this.idInput.value) : false;
            const imageUrl = this.imageInput ? this.imageInput.value : false;
            const imageAlt = this.imageInput ? 'User uploaded post image' : false;
            const tags = this.tagsContainer.querySelectorAll('li')
            tags.forEach((tag)=>tagsArray.push(tag.innerText))
            this.errorMessageText.classList.add('d-none')
            console.log(tags)
            let errorMessage = ""
            let data = {
                'title':title,
                'body':body,
                'tags':tagsArray,
                'media':{
                    'url':imageUrl,
                    'alt':imageAlt,
                }
            }
            if(this.container.classList.contains('edit-mode')){
                const response = await api.call(data,api.postsEndpoint+"/"+id,api.putApi)
                if(response.ok){
                    formHandler.update()
                    formHandler.clearForms()
                }else{
                    errorMessage=await api.getErrorJson(response,'edit post')
                }
            }else{
                const response = await api.call(data,api.postsEndpoint,api.postApi)
                if(response.ok){
                    formHandler.update()
                    formHandler.clearForms()
                    this.container.classList.add('form-hidden')
                }else{
                    errorMessage=await api.getErrorJson(response,'create post')
                }
            }
            if(errorMessage!=""){
                this.errorMessageText.innerText=errorMessage;
                this.errorMessageText.classList.remove('d-none')
            }
        }
    }
    /**
     * Send the post to be edited, this will be sent to both pc and mobile form
     * @param {array} post 
     */
    editThis(post) {
        const { media, id, title, body, tags } = post 
        this.imageInput.value = media.url;
        this.titleInput.value = title;
        this.bodyInput.value = body;
        this.idInput.value = id;
        let tagsHtml=""
        // tags.forEach((tag)=>tagsHtml+=`<li>${tag}</li>`)
        this.tagsContainer.innerHTML=tagsHtml
        formHandler.activateForm('edit-mode')
        tagsObject.update(tags)
        document.querySelector("#sideMenu #post-form").focus();
        // this.updateImagePreview()
        // const imagePreview = document.querySelector('#sideMenu #imagePreview')
        imagePreview.scrollIntoView({ behavior: 'smooth' });
    }
    /**
     * Template for universal form
     * @returns html of the form
     */
    template(){return `
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
        </div>
        <div id="tags-input-group" class="input-group">
            <input type="text" class="clearable" id="tagInput" placeholder="Add tags" aria-label="Add tags" aria-describedby="add-tags">
            <button id="add-tags" class="add-tags" type="button">Add</button>
        </div>

        <ul class="tags-list list-unstyled col-12"></ul>
        <div class="buttons col-12 flex-row">
            <div class="button-container only-post-mode">
                <button type="submit" class="btn btn-primary">Post</button>
            </div>
            <div class="button-container only-edit-mode">
                <button type="submit" class="btn btn-primary">Edit post</button>
            </div>
            <div class="button-container only-edit-mode">
                <button id="delete-button" type="button" class="btn btn-primary" class="btn btn-primary">Delete</button>
            </div>
            <div class="button-container only-edit-mode">
                <button id="cancel-button" type="button red-button" class="btn btn-primary" class="btn btn-primary">Cancel</button>
            </div>
        </div>
        <div id="errorMessageText" class="error-message alert alert-danger d-none text-center">
        </div>
    `
    }
}
