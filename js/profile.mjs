import { getUrlParam, getUserName } from "../js/global.mjs";
import { api } from "../js/apiCalls.mjs";
import { formHandler } from "./formHandler.mjs";
let modalObject;

const Modal = await import("./modal.mjs");
modalObject = new Modal.default();


export default class Profile {
    constructor(){
        this.profilePage =document.getElementById('profile-page')
        this.userName = getUrlParam('user') ? getUrlParam('user') : getUserName()
    }
    async render(){
        const respons = await api.call('',api.profileEndPoint+'/'+this.userName,api.getApi)
        const json = await respons.json()    
        this.userData = json.data
        this.loggedInUser = getUserName()
        console.log(this.userData)
        this.profilePage.innerHTML=this.template(this.userData)
        const postRespons = await api.call('',api.profileEndPoint+"/"+this.userName+"/posts",api.getApi, api.allPostDetails)
        const jsonPosts = await postRespons.json()
        formHandler.update(jsonPosts.data)
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
                <div id="profile-info">
                    <h3>${name}</h3>
                    <button id="" class="edit-button icon-button d-none">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <p id="bio-text">${bio}</p>
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
                this.editProfile('banner','New banner url','Change banner')
            })
            const profileImage = document.querySelector('#image-container  .edit-button')
            profileImage.classList.remove('d-none')
            profileImage.addEventListener('click',()=>{
                this.editProfile('avatar','New avatar url','Change avatar')
            })
            const bioEdit = document.querySelector('#profile-info  .edit-button')
            bioEdit.classList.remove('d-none')
            bioEdit.addEventListener('click',()=>{
                this.editProfile('bio','Change bio text','Submit changes')
            })
        }

    }
    async editProfile(editing,title,buttonText){
        modalObject.modalDisplay.innerHTML=this.changeImageForm(title,buttonText)
        if(editing==='bio'){
            let bioText = document.querySelector('#profile-page #bio-text').innerText
            bioText = bioText != 'null' ? bioText : ''
            modalObject.modalDisplay.querySelector('input').value=bioText
        }
        let changeCount = 0
        const inputField = modalObject.modalDisplay.querySelector('input')
        inputField.addEventListener('click',()=>changeCount++)
        modalObject.show()
        const submitButton = modalObject.modalDisplay.querySelector('button')
        submitButton.addEventListener('click',async ()=>{
            event.preventDefault()
            const inputValue = inputField.value
            if(inputValue!=""){
                const body={}
                if(editing==='avatar'){
                    body.avatar={
                            "url": inputValue,
                            "alt": "string"             
                    }
                }else if(editing==='banner'){
                    body.banner={
                            "url": inputValue,
                            "alt": "string"             
                    }
                }else if(editing==='bio'){
                    body.bio=inputValue
                }else{
                    return
                }
                const response = await api.call(body,api.profileEndPoint+'/'+this.userName,api.putApi)
                console.log("response",response)

                if(!response.ok){
                    let errorMessage = await api.getErrorJson(response,'update profile images')
                    const errorBox = modalObject.modalDisplay.querySelector('#error-box')
                    const form = errorBox.closest('.form-part'); 
                    errorBox.innerText=errorMessage
                    form.classList.add('is-invalid')
                }else{
                    modalObject.hide()
                    this.render()
                }
            }
        })
    }
    changeImageForm(title,buttonText){
        return`
            <form id="edit-profile-form" class="form-container flex-column">    
                <div class="form-part">
                    <label for="imageUrl" class="form-label mb-2">${title}</label>
                    <input required 
                        type="text" 
                        class="form-control clearable" 
                        id="imageUrlInput" 
                        name="imageUrl" 
                        value=""
                    />
                    <div id="error-box" class="invalid-feedback"></div>
                </div>
                <button type="submit">${buttonText}</button>
                
            </form>
        `
    }

}
