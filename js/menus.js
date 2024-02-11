const onlyPc = "nav-item d-none d-sm-inline"
const onlyMb = "d-sm-none d-inline"
const size = 'fs-5'

const currentPath = window.location.pathname.toLowerCase();

const menu ={
    'items':[
        [`bi bi-house`,'Home','../index.html'],
        ['bi bi-search', 'Explore','../feed/index.html'],
        ['bi bi-play-circle', 'Videos'],
        ['bi bi-chat', 'Messages'],
        ['bi bi-person', 'Profile'],
        ['bi bi-bell', 'Notifications'],
        ['bi bi-gear', 'Settings'],
        ['',`Logged in as ${getUserName()}`,'','mt-4'],
        ['bi bi-box-arrow-in-left', 'Log out','','','signOut()'],
        ['bi bi-plus-circle', 'Add post','#',onlyMb,'toggleAddPost()']
    ],
    createListItem([icon,text,url,addClasses,action]){
        url = url ? url : '#';
        addClasses = addClasses ? addClasses : '';

        if(url==='..'+currentPath){
            addClasses+=' active'
        }
        if(action){
            return `
            <li class="nav-item ${addClasses}">
                <button class="nav-link" onclick="${action}">
                    <i class="${icon} ${size}"></i>
                    <span class="${size}">${text}</span>
                </button>
            </li>`;
        }else{
            return `
            <li class="nav-item ${addClasses}">
                <a class="nav-link" href="${url}">
                    <i class="${icon} ${size}"></i>
                    <span class="${size}">${text}</span>
                </a>
            </li>`;
        }
    }
}

function addMenus (){
    //Add side menu and bottom menu (mobile)
    let listItems = ""
    menu.items.forEach(item => {
        listItems+=menu.createListItem(item)
    });
    let sideMenu =`<ul class="col list-unstyled ps-1">${listItems}</ul>`
    document.getElementById('nav-menu').innerHTML=sideMenu

    //Add search functions
    const searchField = document.querySelector('#searchField');
    searchField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            // Execute your search logic here
            console.log('Search query:', event.target.value);
            addPosts(event.target.value)
        }
    });

    document.getElementById('post-form-container').innerHTML=postFormsTemplate()
    const postFormTarget = document.getElementById('post-form')
    postFormTarget.addEventListener('submit', (event) => submitPostForm(event));
    document.getElementById('imageUrlInput').addEventListener('change',()=>updateImagePreview())
    const tagsInputGroup = document.getElementById('tags-input')
    addTagsFunctions(tagsInputGroup)
}
function addTagsFunctions(tagsInputGroup){
    const inputField = tagsInputGroup.querySelector('input')
    const tagsbutton = tagsInputGroup.querySelector('button')
    tagsbutton.addEventListener('click',()=>{
        console.log(inputField.value)
    })
}
function updateImagePreview(){
    const imagePreview = document.getElementById('imagePreview')
    const imageUrlInput = document.getElementById('imageUrlInput')
    const dummyImage = new Image();

    dummyImage.src=imageUrlInput.value
    dummyImage.onload = function(){
        imagePreview.src=imageUrlInput.value
    }
    dummyImage.onerror = function(){
        // stolen image
        imagePreview.src = 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
    }
}
addMenus()
function getUserName(){
    const userName = getLocal('userName')
    return userName
}
function signOut(){
    localStorage.clear()
    window.location.href = '../index.html'
}
function toggleAddPost(){
    console.log("button")
}
    const formContainer = document.querySelector('#post-form')
function activateForm(type){
    event.preventDefault();

    if(type==='edit'){
        formContainer.classList.add('edit-mode')
    
    }else{
console.log("change to psot")
        formContainer.classList.remove('edit-mode')
        clearForm()
    }
}
function clearForm(){
console.log('try clear',formContainer)
    const inputs = formContainer.querySelectorAll('.clearable')
    inputs.forEach(input => {
        input.value=""
    });
}

function postFormsTemplate(){
    return `
    <form id="post-form" class="col-12" >

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

        <div class="input-group mb-3">
            <input type="text" class="form-control clearable" id="tagInput" placeholder="Add tags" aria-label="Add tags" aria-describedby="add-tags">
            <button class="btn btn-outline-secondary" type="button" id="add-tags">Add</button>
        </div>
        <ul id="tags-list" class="list-unstyled"></ul>

        <button type="submit" class="only-post-mode btn btn-primary">Post</button>

        <button type="submit" class="only-edit-mode btn btn-primary">Edit post</button>

        <button class="only-edit-mode btn btn-primary" onclick="activateForm('post')" class="btn btn-primary">Cancel</button>


        <div id="errorMessageText" class="error-message alert alert-danger d-none text-center">
        </div>
    </form>`
}