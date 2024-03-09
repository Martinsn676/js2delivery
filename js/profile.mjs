import { getUrlParam, getUserName } from "../js/global.mjs";
import { api } from "../js/apiCalls.mjs";
import { formHandler } from "./formHandler.mjs";
let modalObject;

const Modal = await import("./modal.mjs");
const editModal = new Modal.default('edit-modal');


export default class Profile {
    constructor(){
        this.profilePage =document.getElementById('profile-page')
        this.userName = getUrlParam('user') ? getUrlParam('user') : getUserName()
    }
    /**
     * Render profile page of user based on indicated in url
     */
    async render(){
        const respons = await api.call('',api.profileEndPoint+'/'+this.userName,api.getApi,api.allProfileDetails)
        if(respons.ok){
            const json = await respons.json()    
            this.userData = json.data
            this.loggedInUser = getUserName()
            this.profilePage.innerHTML=this.template(this.userData)
            // formHandler.update(this.userData.posts,this.userName)
            this.addFunctions()
        }else{
            console.warn('profile not found')
            window.location.href="/profile/index.html"
        }
    }
    /**
     * Creates template with profile info
     * @param {respons} respons from profile api call 
     * @returns 
     */
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
    /**
     * Add functions to the profile page
     */
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
    /**
     * 
     * @param {string} editing can be either bio/banner/avatar
     * @param {string} title Custom title to show as label
     * @param {string} buttonText Custom text to show on button
     */
    async editProfile(editing,title,buttonText){
        let isInput = true
        let inputField = 'input'
        if(editing==='bio'){
            inputType = false
        }
        editModal.modalDisplay.innerHTML=await this.editFormHTML(title,buttonText,isInput)
        let editText = ""
        inputField = editModal.modalDisplay.querySelector('#edit-form-input')
        if(editing==='bio'){
            editText = document.querySelector('#profile-page #bio-text').innerText
            editText = editText != 'null' ? editText : ''
            inputField.value = editText
        }
        console.log(inputField)
        const submitButton = editModal.modalDisplay.querySelector('button')
        editModal.show()
        inputField.addEventListener('keyup',()=>checkForm());
        checkForm()
        function checkForm(){
            if(inputField.value==="" || inputField.value===editText){
                submitButton.disabled=true
            }else{
                submitButton.disabled=false
            }
        }
        submitButton.addEventListener('click',async (event)=>{
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

                if(!response.ok){
                    let errorMessage = await api.getErrorJson(response,'update profile images')
                    const errorBox = modalObject.modalDisplay.querySelector('#error-box')
                    const form = errorBox.closest('.form-part'); 
                    errorBox.innerText=errorMessage
                    form.classList.add('is-invalid')
                }else{
                    formHandler.hideModal()
                    this.render()
                }
            }
        })
    }
    /**
     * Create edit form depending on edited object
     * @param {string} title 
     * @param {string} buttonText 
     * @param {string} isInput 
     * @returns html of the edit form
     */
    editFormHTML(title,buttonText,isInput){
        return`
            <form id="edit-profile-form" class="form-container flex-column">    
                <div class="form-part">
                    <label for="imageUrl" class="form-label mb-2">${title}</label>
                    ${isInput==='input' ?
                    `
                    <input required 
                        id="edit-form-input"
                        type="text" 
                        class="form-control clearable" 
                        name="editInput" 
                        value=""
                    />
                    `
                    :
                    `
                    <textarea  required 
                        id="edit-form-input"
                        type="text" 
                        class="form-control clearable" 
                        name="editInput" 
                        value=""
                    ></textarea >
                    `
                    }

                    <div id="error-box" class="invalid-feedback"></div>
                </div>
                <button type="submit">${buttonText}</button>
                
            </form>
        `
    }

}
