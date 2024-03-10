import { api } from "./apiCalls.mjs";
import { getUrlParam, getUserName } from "./global.mjs";
import PostImport from "../js/loadPosts.mjs"

const Post = new PostImport

export const formHandler = {
    async setup(){
        this.PostFormImport = await import("./postForms.mjs");
        this.update()
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
        })

    },
    async update(search){
        let pageTitle = document.title
        if(pageTitle==='Profile page on Social Media'){
            let username = getUrlParam('user')
            username = username ? username : getUserName()
            const postRespons = await api.call('',api.profileEndPoint+"/"+username+"/posts",api.getApi, api.allPostDetails)
            const jsonPosts = await postRespons.json()
            console.log(jsonPosts)
            Post.updatePosts(jsonPosts.data,username)
        }else{
            Post.updatePosts(false,search)
        }
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
        const urlWithoutQueryString = window.location.href.split('?')[0];
        window.history.replaceState({}, '', urlWithoutQueryString);
    },
    hideModal(){
        document.getElementById('modal').classList.add('hide-modal')
        const editModal = document.getElementById('edit-modal')
        if(editModal){editModal.classList.add('hide-modal')}
    }

}

formHandler.setup()