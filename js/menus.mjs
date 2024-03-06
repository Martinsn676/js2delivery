import { getUserName } from "./global.mjs"
import { submitPostForm } from "./postForms.mjs"
import { signOut } from "./global.mjs"
import { postsObject } from "./loadPosts.mjs"


const onlyPc = "nav-item d-none d-sm-inline"
const onlyMb = "d-sm-none d-inline"
const size = 'fs-5'
const noUrl = '#'
const currentPath = window.location.pathname.toLowerCase();

const menu ={
    'pcItems':[
        ['<div class="main-logo"><img src="../files/logoWide.png"></div>','','','col-6'],
        [`bi bi-house`,'Home','../feed/index.html','button'],
        ['bi bi-instagram', 'Explore','../feed/index.html','button'],
        ['bi bi-play-circle', 'Videos',noUrl,'button'],
        ['bi bi-chat', 'Messages',noUrl,'button'],
        ['bi bi-person', 'Profiles','../profile/allProfiles.html','button'],
        ['bi bi-bell', 'Notifications',noUrl,'button'],
        ['bi bi-gear', 'Settings',noUrl,'button'],
        ['',`Logged in as ${getUserName()}`,`../profile/index.html?user=${getUserName()}`,'mt-4',],
        ['bi bi-box-arrow-in-left', 'Log out','signOutButton','button'],
        
    ],
    //text left to be used as helping tool or something
    'bottomItems':[
        [`bi bi-house`,'Home','../feed/index.html'],
        ['bi bi-instagram', 'Explore','../feed/index.html'],
        ['bi bi-play-circle', 'Videos',noUrl],
        ['bi bi-chat', 'Messages',noUrl],
        ['bi bi-plus-circle', 'Add post',noUrl,'toggle-post-button'],
    ],
    'topItems':[
        ['bi bi-search', 'Explore','search()'],
        ['<div class="main-logo"><img src="../files/logoWide.png"></div>', 'Videos',noUrl,'col-6'],
        ['bi bi-bell', 'Notifications'],
    ],
    addItems(items){
        let menuItems = ""
        items.forEach(item => {
            menuItems+=menu.createMenu(item)
        });
        return menuItems
    },
    createMenu([icon,text,action,addClasses]){
        action = action ? action : '#';
        addClasses = addClasses ? addClasses : '';

        if(action==='..'+currentPath){
            addClasses+=' active'
        }
        let type1 = "";
        let type2 = "";
        let display = "";

        if(action[0]!="." && action[0]!="#"){
            //if button, add id for targeting eventlistener
            type1 = `<button class="nav-link icon-button" id="${action}">`
            type2 = `</button>`
        }else{
            type1 = `<a class="nav-link icon-button" href="${action}">`
            type2 = `</a>`
        }
        if(icon[0]!='<'){
            display = `<i class="${icon} ${size}"></i>`
        }else{
            type1 = ""
            type1 = ""
            display = icon   
        }
        return `
            <li class="nav-item ${addClasses}">
                ${type1}
                   ${display}
                   <span class="${size}">${text}</span>
                ${type2}
            </li>`;
    },

    toggleMobileForm(){
        document.getElementById('mobile-form').classList.toggle('form-hidden')
    },
    addMenus (){
        document.getElementById('nav-menu').innerHTML =`
            <ul class="col list-unstyled hide-mb">
                ${menu.addItems(menu.pcItems)}
            </ul>`
        document.getElementById('bottom-menu').innerHTML = `
            <ul class="justify-content-between hide-pc">
                ${menu.addItems(menu.bottomItems)}
            </ul>`
        document.getElementById('top-section').innerHTML=`
            <ul class="justify-content-between hide-pc">
                ${menu.addItems(menu.topItems)}
            </ul>
            <form id="mobile-form" class="form-container form-hidden">
                ${formObject.postTemplate}
            </form>`
        const filterMenu = document.getElementById('filter-menu')
        if(filterMenu){
            document.getElementById('filter-menu').innerHTML=`        
                <div class="col-6 ">
                <input id="searchField" type="text" class="form-control border-primary text-left rounded-1"
                    placeholder="Themes, feelings, places ... ">
                </input>
                </div>
                <div class="col-4">
                <select class="">
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popularity">Popularity</option>
                </select>
                </div>`
        }
        //Add mobile form
        document.getElementById('mobile-form').innerHTML=formObject.postTemplate

        //Add search functions
        const searchField = document.querySelector('#searchField');
        if(searchField){
            searchField.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    // Execute your search logic here
                    console.log('Search query:', event.target.value);
                    postsObject.updatePosts(event.target.value)
                }
            });

        }


        document.getElementById('post-form').innerHTML=formObject.postTemplate
        formObject.container = document.getElementById('post-form')
        formObject.templateFunctions()
        
        formObject.container.addEventListener('submit', (event) => submitPostForm(event));
        const imageInput = document.querySelector('#sideMenu #imageUrlInput')
        console.log(imageInput)
        imageInput.addEventListener('change',()=>formObject.updateImagePreview(event))
        const toggleFormbutton = document.querySelector('#bottom-menu .toggle-post-button')
        const signOutButton = document.getElementById('signOutButton')
        signOutButton.addEventListener('click',signOut)
        toggleFormbutton.addEventListener('click',()=>toggleMobileForm())
        tagsObject.addTagsButton = document.querySelector("#sideMenu #add-tags")
        tagsObject.tagsLists = document.querySelectorAll('.tags-list')
        tagsObject.tagInputs = document.querySelectorAll('.tagInput')
        tagsObject.addTagsButton.addEventListener('click',()=>tagsObject.addTag())
    }
}
export const tagsObject = {
    'tags':[],
    //Check if already excist and removce if it does
    toggleTag(text){
        console.log("toggle tag",text)
        if(text!=""){
            for(let i = 0; i < this.tags.length; i++){
                if(this.tags[i]===text){
                    this.tags.splice(i,1)
                    this.update()
                    return
                }
            }
            this.tags.push(text)
            this.update()
            console.log(this.tags)
        }

    },
    //Update tags container
    update(){
        let html = ''
        this.tags.forEach(tag=>{
               html+=`<li>${tag}</li>`
        })
        this.tagsLists.forEach((list)=>{
            list.innerHTML=html
            const allTags = list.querySelectorAll('li')
            allTags.forEach(tag=>{
                tag.addEventListener('click',(target)=>{
                    this.toggleTag(target.explicitOriginalTarget.innerText)
                });
            });
        })

    },
    addTag(tag){
        event.preventDefault()
        let value = ""
        if(tag){
            value = tag
        }else{
            const inputField = event.target.parentElement.querySelector('#tagInput')
            value = inputField.value
            inputField.value=""
        }
        tagsObject.toggleTag(value)
    }
}

export const formObject = {
    activateForm(type){
        if(type==='edit'){
            this.container.classList.add('edit-mode')
        }else if(type==='post'){
            this.container.classList.remove('edit-mode')
        }
    },
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
        
    },
    clearWarning(){
        const errorMessageText = formObject.container.querySelector('#errorMessageText')
        errorMessageText.classList.add('d-none')
    },
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
    },
    editThis(post) {
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
        this.activateForm('edit')
        this.updateImagePreview()
        const imagePreview = document.querySelector('#sideMenu #imagePreview')
        imagePreview.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling
    },
    templateFunctions(){
        this.container.querySelector('#cancel-button').addEventListener('click',()=>{
            event.preventDefault()
            this.clearForm()
        })
        this.container.querySelector('#delete-button').addEventListener("click", () => postsObject.deletePost());
    },
    'postTemplate':`
        
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
    `,

}


menu.addMenus()
