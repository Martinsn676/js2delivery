import { getUrlParam, getUserName } from "../js/global.mjs";
import { api } from "../js/apiCalls.mjs";

let postsObject;
let modalObject;

const Modal = await import("./modal.mjs");
modalObject = new Modal.default();
const Post = await import("./loadPosts.mjs");
postsObject = new Post.default();

export default class Profile {
    constructor(){
        this.profilePage =document.getElementById('profile-page')
        this.userName = getUrlParam('user') ? getUrlParam('user') : getUserName()
        this.setup()
    }
    async setup(){
        const respons = await api.call('',api.profileEndPoint+'/'+this.userName,api.getApi)
        const json = await respons.json()    
        this.userData = json.data
        this.loggedInUser = getUserName()
        console.log(this.userData)
        this.profilePage.innerHTML=this.template(this.userData)
        const postRespons = await api.call('',api.profileEndPoint+"/"+this.userName+"/posts",api.getApi, postsObject.settings.endApi)
        const jsonPosts = await postRespons.json()

        postsObject.addPosts(jsonPosts.data)     
        this.addFunctions()
    }
    template({avatar,banner,bio,email,name}){
        return `
    <div class="flex-column">
        <div id="banner-container">
            <img src="${banner.url}">
            <button id="" class="edit-button icon-button d-none">
                <i class="bi bi-pencil-fill"></i>
            </button>
        </div>
        <div class="flex-row">
            <div class="left-side col-6">

                <div id="image-container" class="">
                    <button id="" class="edit-button icon-button d-none">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <img id="profile-image" src="${avatar.url}">
                </div>
            </div>
            <div class="right-side col-6">
                <div class="">
                    <h3>${name}</h3>
                    <p>${bio}</p>
                </div>
            </div>
        </div>
    </div>`
    }
    addFunctions(){
        if(this.loggedInUser===this.userData.name){
            const bannerImage = document.querySelector('#banner-container .edit-button')
            bannerImage.classList.remove('d-none')
            bannerImage.addEventListener('click',()=>{
                this.editImage('banner')
            })
            const profileImage = document.querySelector('#image-container  .edit-button')
            profileImage.classList.remove('d-none')
            profileImage.addEventListener('click',()=>{
                this.editImage('profile')
            })
        }

    }
    async editImage(editing){
        modalObject.modalDisplay.innerHTML=this.changeImageForm()
        modalObject.show()
        const submitButton = modalObject.modalDisplay.querySelector('button')
        submitButton.addEventListener('click',async ()=>{
            event.preventDefault()
            const newUrl = modalObject.modalDisplay.querySelector('input').value
            if(newUrl!=""){
                const body={}
                if(editing==='profile'){
                    body.avatar={
                            "url": newUrl,
                            "alt": "string"             
                    }
                }else if(editing==='banner'){
                    body.banner={
                            "url": newUrl,
                            "alt": "string"             
                    }
                }else{
                    return
                }

                const response = await api.call(body,api.profileEndPoint,api.putApi,'/'+this.userName)
                console.log("response",response)
               
                if(!response.ok){
                    let errorMessage = await api.getErrorJson(response,'update profile images')
                    const errorBox = modalObject.modalDisplay.querySelector('#error-box')
                    errorBox.innerText=errorMessage
                }else{
                    modalObject.hide()
                }
            }
        })
    }
    changeImageForm(){
        return`
            <form id="change-image-form" class="form-container flex-column">
                <label for="imageUrl" class="form-label mb-2">Image url</label>
                <input required 
                    type="text" 
                    class="form-control clearable" 
                    id="imageUrlInput" 
                    name="imageUrl" 
                    value=""
                />
                <button type="submit">Change image</button>
                <div id="error-box" class="invalid-feedback"></div>
            </form>
        `
    }

}
