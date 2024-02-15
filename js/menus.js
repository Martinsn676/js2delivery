const onlyPc = "nav-item d-none d-sm-inline"
const onlyMb = "d-sm-none d-inline"
const size = 'fs-5'
const noUrl = '#'
const currentPath = window.location.pathname.toLowerCase();

const menu ={
    'pcItems':[
        ['<div class="main-logo"><img src="../files/logoWide.png"></div>','',noUrl,'col-6'],
        [`bi bi-house`,'Home','../index.html','button'],
        ['bi bi-instagram', 'Explore','../feed/index.html','button'],
        ['bi bi-play-circle', 'Videos',noUrl,'button'],
        ['bi bi-chat', 'Messages',noUrl,'button'],
        ['bi bi-person', 'Profile',noUrl,'button'],
        ['bi bi-bell', 'Notifications',noUrl,'button'],
        ['bi bi-gear', 'Settings',noUrl,'button'],
        ['',`Logged in as ${getUserName()}`,noUrl,'mt-4',],
        ['bi bi-box-arrow-in-left', 'Log out','signOut()','button'],
        
    ],
    'bottomItems':[
        [`bi bi-house`,'Home','../index.html'],
        ['bi bi-instagram', 'Explore','../feed/index.html'],
        ['bi bi-play-circle', 'Videos',noUrl],
        ['bi bi-chat', 'Messages',noUrl],
        ['bi bi-plus-circle', 'Add post','toggleMobileForm()'],
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
            type1 = `<button class="nav-link icon-button" onclick="${action}">`
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
}
function toggleMobileForm(){
    document.getElementById('mobile-form').classList.toggle('form-hidden')

}

function addMenus (){
    document.getElementById('nav-menu').innerHTML =`<ul class="col list-unstyled hide-mb">${menu.addItems(menu.pcItems)}</ul>`
    document.getElementById('bottom-menu').innerHTML = `<ul class="justify-content-between hide-pc">${menu.addItems(menu.bottomItems)}</ul>`
    document.getElementById('top-section').innerHTML=`<ul class="justify-content-between hide-pc">${menu.addItems(menu.topItems)}</ul>`

    //Add mobile form
    document.getElementById('mobile-form').innerHTML=mobileForm()

    //Add search functions
    const searchField = document.querySelector('#searchField');
    searchField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            // Execute your search logic here
            console.log('Search query:', event.target.value);
            addPosts(event.target.value)
        }
    });

    document.getElementById('post-form').innerHTML=formObject.pcTemplate
    formObject.container = document.getElementById('post-form')
    formObject.templateFunctions()
    
    formObject.container.addEventListener('submit', (event) => submitPostForm(event));
    document.getElementById('imageUrlInput').addEventListener('change',()=>formObject.updateImagePreview())
    

    tagsObject.target = document.querySelector('#sideMenu #tags-list')
    const inputField = document.querySelector('#sideMenu #tagInput')
    tagsObject.inputField = inputField
}
const tagsObject = {
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
        this.target.innerHTML=html
        allTags = this.target.querySelectorAll('li')
        allTags.forEach(tag=>{
            tag.addEventListener('click',(target)=>{
                console.log(target.explicitOriginalTarget.innerText)
                this.toggleTag(target.explicitOriginalTarget.innerText)
            });
        });
    },
    // addTagsFunctions(){
    //     const tagsInputGroup = document.getElementById('tags-input-group')
    //     const inputField = tagsInputGroup.querySelector('input')
    //     const tagsbutton = tagsInputGroup.querySelector('button')
    //     tagsbutton.addEventListener('click',()=>{
    //         this.toggleTag(inputField.value)
    //         inputField.value=""
    //     })
    // }
}
function toggleTag(){
event.preventDefault()

    tagsObject.toggleTag(tagsObject.inputField.value)
}
const formObject = {
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
        console.log("cear for ")
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
    updateImagePreview(url){
        const imagePreview = document.getElementById('imagePreview')
        url = url ? url :document.getElementById('imageUrlInput').value
        const dummyImage = new Image();
        if(url===""){
            imagePreview.classList.add('d-none')
        }else{
            imagePreview.classList.remove('d-none')
            dummyImage.src=url

            dummyImage.onload = function(){
                imagePreview.src=url
            }
            dummyImage.onerror = function(){
                // stolen image
                imagePreview.src = 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
            }
        }
    },
    templateFunctions(){
        this.container.querySelector('#cancel-button').addEventListener('click',()=>{
            event.preventDefault()
            this.clearForm()
        })
        this.container.querySelector('#delete-button').addEventListener("click", () => deleteThis());
    },
    'pcTemplate':`
        <img id="imagePreview" src="" class="col-12">
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

        <div id="tags-input-group" class="input-group">
            <input type="text" class="clearable" id="tagInput" placeholder="Add tags" aria-label="Add tags" aria-describedby="add-tags">
            <button class="" onclick="toggleTag()" type="button" id="add-tags">Add</button>
        </div>

        <ul id="tags-list" class="list-unstyled col-12"></ul>
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


addMenus()
function mobileForm(){
    return `
        <form id="mobile-form" class="col-12">

        <img id="imagePreview" src="" class="col-12">
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

        <div id="tags-input-group" class="input-group mb-3">
            <input type="text" class="form-control clearable" id="tagInput" placeholder="Add tags" aria-label="Add tags" aria-describedby="add-tags">
            <button class="btn btn-outline-secondary" type="button" id="add-tags">Add</button>
        </div>
        <ul id="tags-list" class="list-unstyled col-12"></ul>
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
    </form>

    `
}