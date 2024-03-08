// menus.mjs
import { getUserName } from "./global.mjs";
import { signOut } from "./global.mjs";
import { formHandler } from "./formHandler.mjs";

const noUrl = '#'
const currentPath = window.location.pathname.toLowerCase();
const size = 'fs-5'

const tagImport = await import("./tags.mjs");
const tagsObject = new tagImport.default();

const PostImport = await import("./loadPosts.mjs");
const Post = new PostImport.default();


export default class Menu {
    constructor(){
        this.pcItems=[
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
        
        ]
        //text left to be used as helping tool or something
        this.bottomItems=[
            [`bi bi-house`,'Home','../feed/index.html'],
            ['bi bi-instagram', 'Explore','../feed/index.html'],
            ['bi bi-play-circle', 'Videos',noUrl],
            ['bi bi-chat', 'Messages',noUrl],
            ['bi bi-plus-circle', 'Add post',noUrl,'toggle-post-button'],
        ],
        this.topItems=[
            ['bi bi-search', 'Explore','search()'],
            ['<div class="main-logo"><img src="../files/logoWide.png"></div>', 'Videos',noUrl,'col-6'],
            ['bi bi-bell', 'Notifications'],
        ]
    }
    addItems(items){
        let menuItems = ""
        items.forEach(item => {
            menuItems+=this.createMenu(item)
        });
        return menuItems
    }
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
    }

    toggleMobileForm(){
        document.getElementById('mobile-form').classList.toggle('form-hidden')
    }
    async addMenus (){
        document.getElementById('nav-menu').innerHTML =`
            <ul class="col list-unstyled hide-mb">
                ${this.addItems(this.pcItems)}
            </ul>`
        document.getElementById('bottom-menu').innerHTML = `
            <ul class="justify-content-between hide-pc">
                ${this.addItems(this.bottomItems)}
            </ul>`
        document.getElementById('top-section').innerHTML=`
            <ul class="justify-content-between hide-pc">
                ${this.addItems(this.topItems)}
            </ul>
            <form id="mobile-form" class="form-container form-hidden blue-buttons ">
            </form>`
        const filterMenu = document.getElementById('filter-menu')
        if(filterMenu){
            document.getElementById('filter-menu').innerHTML=`        
                <div class="col-6">
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


        //Add search functions
        const searchField = document.querySelector('#searchField');
        if(searchField){
            searchField.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') {
                    // Execute your search logic here
                    console.log('Search query:', event.target.value);
                    Post.updatePosts(event.target.value)
                }
            });

        }

        //Add mobile form

        formHandler.addForm(document.getElementById('post-form'))
        //formHandler.addForm(document.getElementById('mobile-form'))


        const signOutButton = document.getElementById('signOutButton')
        signOutButton.addEventListener('click',signOut)

        // tagsObject.addTagsButton = document.querySelector("#sideMenu #add-tags")
        
        // tagsObject.tagInputs = document.querySelectorAll('.tagInput')
        // tagsObject.addTagsButton.addEventListener('click',(event)=>tagsObject.addTag(event))
    }
}
