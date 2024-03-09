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
        //Not the easiest way, but practice for building my own backend for handling website design
        this.pcItems=[
        ['<div class="main-logo"><img src="../files/logoWide.png"></div>','','','col-6'],
        [`house`,'Home','../feed/index.html','button'],
        ['instagram', 'Explore','../feed/index.html','button'],
        ['play-circle', 'Videos',noUrl,'button'],
        ['chat', 'Messages',noUrl,'button'],
        ['person', 'Profiles','#','button'],
        ['bell', 'Notifications',noUrl,'button'],
        ['gear', 'Settings',noUrl,'button'],
        ['',`Logged in as ${getUserName()}`,`../profile/index.html?user=${getUserName()}`,'mt-4',],
        ['box-arrow-in-left', 'Log out','signOutButton','button'],
        
        ]
        //text left to be used as helping tool or something
        this.bottomItems=[
            [`house`,'Home','../feed/index.html'],
            ['instagram', 'Explore','../feed/index.html'],
            ['play-circle', 'Videos',noUrl],
            ['chat', 'Messages',noUrl],
            ['plus-circle', 'Add post','toggle-post-button','button'],
        ],
        this.topItems=[
            ['search', 'Explore','search()'],
            ['<div class="main-logo"><img src="../files/logoWide.png"></div>', 'Videos',noUrl,'col-6'],
            ['bell', 'Notifications'],
        ]
    }
    /**
     * Dynamically creates the menu items
     * @param {Array} items Picked from the ones created in constructor
     * @returns html of the menu list
     */
    addItems(items){
        let menuItems = ""
        items.forEach(item => {
            menuItems+=this.createMenu(item)
        });
        return menuItems
    }
    /**
     * Calculates and creates the invdividual list item
     * @param {Array} array The array of a single menu item
     * @returns single html list item
     */
    createMenu([icon,text,action,addClasses]){
        action = action ? action : '#';
        addClasses = addClasses ? addClasses : '';

        if(action==='..'+currentPath){
            addClasses+=' active'
        }
        let type1 = "";
        let type2 = "";
        let display = "";
        //Check if url or url alternative
        if(action[0]!="." && action[0]!="#"){
            //if button, add class for targeting eventlistener
            type1 = `<button class="nav-link icon-button ${action}">`
            type2 = `</button>`
        }else{
            type1 = `<a class="nav-link icon-button" href="${action}">`
            type2 = `</a>`
        }
        //check if a special html object
        if(icon[0]!='<'){
            display = `<i class="bi bi-${icon} ${size}"></i>`
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
    /**
     * Toggle the mobile form display on and off
     */
    toggleMobileForm(){
        document.getElementById('mobile-form').classList.toggle('form-hidden')
    }
    /**
     * Adds all the menus upon load
     */
    async addMenus (){
        document.getElementById('nav-menu').innerHTML =`
            <ul class="col list-unstyled hide-mb">
                ${this.addItems(this.pcItems)}
            </ul>`
        document.getElementById('bottom-menu').innerHTML = `
            <ul class="nav-menu hide-pc">
                ${this.addItems(this.bottomItems)}
            </ul>`
        document.getElementById('top-section').innerHTML=`
            <ul class="nav-menu hide-pc">
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
                    Post.updatePosts(false,event.target.value)
                }
            });

        }
        //add pc form
        await formHandler.addForm(document.getElementById('post-form'))

        //Add mobile form
        const mobileForm = document.getElementById('mobile-form')   
        await formHandler.addForm(mobileForm)
        const mbPostFormToggle =  document.querySelector('.toggle-post-button')
        mbPostFormToggle.addEventListener('click',()=>{
            mobileForm.classList.toggle('form-hidden')
        })

        //add functions to signoutbutton
        const signOutButton = document.querySelector('.signOutButton')
        signOutButton.addEventListener('click',signOut)
    }
}
