import { api } from "./apiCalls.mjs";
import PostImport from "../js/loadPosts.mjs"

const Post = new PostImport

export const formHandler = {
    async setup(){
        this.PostFormImport = await import("./postForms.mjs");
    },
    async addForm(target){
        const PostFormImport = await import("./postForms.mjs");
        if(!this.PostForms){this.PostForms=[]}
        this.PostForms.push(await new PostFormImport.default(target));
        console.log(this.PostForms)
    },
    clearForms(){
        this.PostForms.forEach((form)=>{
           form.clearForm()
console.log("clearing form",form)
        })

    },
    update(preLoaded,search){
        Post.updatePosts(preLoaded,search)
    },
    activateForm(type){
        if(type!='edit-mode'){
            this.PostForms.forEach((form)=>{
            form.container.classList.remove('edit-mode')
        this.clearForms()
            }) 
        }else{
            this.PostForms.forEach((form)=>{
                form.container.classList.add('edit-mode')
            }) 
        }
    },
    async comment(target){
        const id = target.querySelector('[name="postID"]').value
        const commentInput =target.querySelector('[name="text"]')
        const data = {
                'body':commentInput.value
            }
        const response = await api.call(data,api.postsEndpoint+`/${id}/comment`,api.postApi)
        if(response.ok){
            commentInput.value=""
            await Post.updatePosts()
            Post.displayPost(id)
        }            
    },
    async editThis(id,mobile){
        this.PostForms.forEach((form)=>{
            form.editThis(id)
        })
        if(mobile){
            document.getElementById('mobile-form').classList.remove('form-hidden')
        }
    },
    hideModal(){
        document.getElementById('modal').classList.add('hide-modal')
        document.getElementById('edit-modal').classList.add('hide-modal')
    }

}

formHandler.setup()