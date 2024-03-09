import { getUserName,getUrlParam  } from "./global.mjs"
import { api } from "./apiCalls.mjs"
import { formHandler } from "./formHandler.mjs";

const Modal = await import("./modal.mjs");
const modalObject = new Modal.default('modal');


export default class Post {
    constructor(){
        this.settings = {
            'bannedStarts' : [
                'https://unsplash.com',
                'https://ibb', 
                'https://url', 
                'Lorem',
                'https://picography.co',
                'test'
                ]
        }
        this.container=document.getElementById(`feedContainer`)
        this.showMore = document.getElementById('show-more-posts')
        this.user=getUserName()
        this.postsArray = []
    }
    /**
     * 
     * @param {response} preLoaded In case no new api call is wanted, False if not
     * @param {string} search Search string
     * @param {string} filter Filter for api call
     * @example 
     *  updatePosts(false,'dog','tag=dog')
     *
     * 
     */
    async updatePosts(preLoaded,search){
        //I try handling the apicall request by getting fedd the string directly or by url.
        //Filter is gotten from url, and search is without changing url on purpose
        let searchResult = "Showing all posts"
        let postsArray
        let filter = ""

        if(!preLoaded){
            search = search ? search :""
            const urlFilter = getUrlParam('tag')
            filter = urlFilter ? `&_tag=${urlFilter}` : filter
            let endPoint = search ? api.searchEndpoint : api.postsEndpoint
            const response = await api.call(search,endPoint , api.getApi, api.allPostDetails+filter);
            const json = await response.json();
            postsArray = json.data
            console.log(postsArray)
        }else{
            postsArray = preLoaded
            
        }
        this.addPosts(postsArray)
        const searchResultContainer = document.getElementById('searchResultContainer')
        if(search!=""){
            searchResult=`
            <div>
                Showing search result for "${search}"
            </div>
            <button id="reset-button" class="blue-button>Reset</button>`
        }else if(filter!=""){
            const splitFilter = filter.split('=');
            searchResult="<div>Showing posts with the tag: "+splitFilter[1]+"</div>"
            searchResult+=`<button id="reset-button" class="blue-button">Reset</button>`
        }
        if(searchResultContainer){
            searchResultContainer.innerHTML=searchResult
            const resetButton = searchResultContainer.querySelector('#reset-button')
            const inProfilePage = window.location.pathname.endsWith("/profile/index.html");
            if(resetButton){
                resetButton.addEventListener('click',()=>{
                    if(inProfilePage){
                        const userParam = getUserName()
                        const user = userParam ? "?user="+userParam : ""
                        this.updatePosts()
                    }else{
                        const urlWithoutQueryString = window.location.href.split('?')[0];
                        window.history.replaceState({}, '', urlWithoutQueryString);
                    }
                    this.updatePosts()
                    document.querySelector('header').scrollIntoView({ behavior: 'smooth' });
                })
            }           
        }
    }
    async addPosts(postsArray,limit){
        console.trace()
        const perLineCalc = Math.ceil(feedContainer.clientWidth/220)
        limit = limit ? limit :perLineCalc*4;
        const addAmount = perLineCalc*4
        console.log("limit",limit,feedContainer.clientWidth)
        const html = await this.createHtml(postsArray,limit)
        feedContainer.innerHTML = ""
        feedContainer.innerHTML = html
        const hiddenPostsCount = feedContainer.querySelectorAll('.post-hidden').length
        // this.container.insertAdjacentHTML("beforeend", html);
        if(hiddenPostsCount>0){
            this.showMore.classList.remove('d-none')
            this.showMore.disabled=false
            this.showMore.addEventListener('click',(event)=>{
                const hiddenPosts = feedContainer.querySelectorAll('.post-hidden')
                for(let i = 0; i < addAmount && i <hiddenPosts.length; i++){
                    hiddenPosts[i].classList.remove('post-hidden')
                }   
                if(hiddenPosts.length-addAmount<=0){
                    this.showMore.disabled=true
                }
            })
        }else{
            this.showMore.disabled=true
        }
        this.postsArray=postsArray
        this.addFunctions()
        // PostForm.container=document.getElementById('form-container')
    }   
    //Blacklisting to hide 
    checkBlackList({ body, media }) {
        for (const banned of this.settings.bannedStarts) {
            if (!media || media.url.startsWith(banned) || body.toLowerCase().startsWith(banned)) {
                return true;
            }
        }
        return false;
    }
    async createHtml(postsArray,limit){
        let html = ""
        let count = 0
        postsArray.forEach((post) => {if(!this.checkBlackList(post)){
            count ++
            const { _count,title,body,created, updated, media, tags, author,id,comments,reactions } = post;
            let editText = "";
            let tagHtml = "";
            let editButtons = "";
            let commentHtml = ""
            let reactiosnHtml =""
            let addPostClasses = ""
            let authorString = author.name
            
            if (created != updated) {
                editText = ' (edited)';
            }
            if(count>limit){
                addPostClasses+="post-hidden"
            }
            if (tags) {
                tags.forEach(tag => {
                    if(tag.length>0){
                    tagHtml += `<li class="tag">${tag}</li>`;

                    }
                });
            }
            if (this.user === author.name) {
                authorString="You"
                editButtons = ` 
                    <div id="edit-post-nav" class="flex-row">                  
                        <button id="edit-post-button-${id}" class="only-expanded edit-button icon-button m-1 col-4"><i class="bi bi-pencil-fill"></i></button>
                        <button id="delete-post-button-${id}" class="only-expanded delete-button icon-button red-icon m-1 col-4"><i class="bi bi-trash-fill"></i></button>
                    </div>
                `
            }
            if(comments[0]){
                for(let i = 0 ; i < comments.length; i++){
                    commentHtml += `
                        <div class="post-comment flex-column">
                            <span class="author">${comments[i].author.name}</span>
                            <span class="text">${comments[i].body}</span>
                            `
                    if(comments[i].author.name===this.user){
                        commentHtml+=`<button id="comment-${id}-${comments[i].id}" class="delete-comment-button">delete</button>`
                    }
                    commentHtml+="</div>"
                };
            }
            //           //  someting is wrong
            if(reactions[0]){
                for(let i = 0 ; i < reactions.length; i++){
                    if(reactions[i].reactors && reactions[i].reactors.find(reactor => reactor === this.user)){
                        reactiosnHtml+=`<div class="post-reactions active">`
                    }else{
                        reactiosnHtml+=`<div class="post-reactions">`
                    }
                    reactiosnHtml += `
                        <span class="icon">${reactions[i].symbol}</span>
                        <span class="quantity">${reactions[i].count}</span>
                        </div>`
                };
            }
            //Disabling the reactions
            reactiosnHtml=""
            const url = media ? media.url : '';
            const date = new Date(created)
            if(limit>1){
                html += `
                <div id="post-${id}" class="media-post-container ${addPostClasses}">
                    <div class="media-post flex-row">
                        <div class="flex-column left-side flex-spread">
                            <div class="text-box">
                                <a class="post-author" href="/profile/index.html?user=${author.name}">@${authorString}</a>
                                    ${editButtons}
                                <h3 class="title">${title}</h3>
                                <span>${date.toLocaleDateString()}${editText}</span>
                                <p class="fs-6 text">${body}</p>
                            </div>
                            <div class="blur"></div>
                            <div class="image-container mt-2 mb-2 flex-column align">
                                <img class="img" src='${url}'>
                            </div>
                            <div class="col-12 flex-column">
                                ${reactiosnHtml}
                            </div>
                            <ul class="tags-container list-unstyled">${tagHtml}</ul>
                            <div id="comment-container" class="flex-row flex-spread">
                                <div class="hide-modal">
                                    <i class="bi bi-chat-left"></i>
                                    <span>${_count.comments}</span>
                                </div>      
                            </div>
                        <div id="mobile-comments" class="flex-column right-side">
                            <div class="comments-container col-12 flex-column">
                                ${commentHtml}
                            </div>
                            <form class="form-container col-12 flex-column comment">
                                <input type="text" class="d-none clearable" id="postID" name="postID" value="${id}"/>
                                <textarea id="textInput" name="text" class="mb-2 form-control clearable border-primary" rows="2" placeholder="Write a comment"></textarea>
                                <button type="submit" >Comment!</button>
                            </form> 
                        </div>
                        </div>
                    </div>
                </div>`
            }else{
                html += `
                <div id="post-${id}" class="media-post-container ${addPostClasses}">
                    <div class="media-post flex-row">
                        <div class="flex-column left-side flex-spread">
                            <div class="modal-text-box">
                                <a class="post-author" href="/profile/index.html?user=${author.name}">@${authorString}</a>
                                    ${editButtons}
                                <h3 class="title">${title}</h3>
                                <span>${date.toLocaleDateString()}${editText}</span>
                                <p class="fs-6 text">${body}</p>
                            </div>
                            <div class="modal-image-container mt-2 mb-2 flex-column align">
                                <img id="original-image" class="img" src='${url}'>
                            </div>
                            <div class="col-12 flex-column">
                                ${reactiosnHtml}
                            </div>
                            <ul class="tags-container list-unstyled">${tagHtml}</ul>
                        </div>
                        <div class="flex-column right-side only-modal">
                            <div class="comments-container col-12 flex-column">
                                ${commentHtml}
                            </div>
                            <form class="form-container col-12 flex-column comment">
                                <input type="text" class="d-none clearable" id="postID" name="postID" value="${id}"/>
                                <textarea id="textInput" name="text" class="mb-2 form-control clearable border-primary" rows="2" placeholder="Write a comment"></textarea>
                                <button type="submit" >Comment!</button>
                            </form> 
                        </div>
                    </div>
                    <div id="modal-image-zoom" class="d-none flex-column align">
                        <img src="${url}">
                        <span>Click to go back</span>
                    </div>
                </div>`
            }
            }
        });
        return html
    }
    addFunctions(){
        let showing = 0
        let banned = 0
        this.postsArray.forEach((post) => {
            const { id } = post;
            const postContainer = document.querySelector(`#feedContainer #post-${id}`);
            if(this.checkBlackList(post)){
                banned++
            }else{
                showing++
                const mediaPost =  postContainer.querySelector('.media-post')
                mediaPost.addEventListener("click", (event) =>{
                    if (event.target.tagName === 'A' || event.target.tagName === 'LI' || event.target.tagName === 'I') {
                        return;
                    }
                        this.displayPost(id)
                });
                this.addButtonClicks(post,postContainer)
            }
        });
        console.groupCollapsed('Posts data',showing+"/"+this.postsArray.length)
            console.log(this.postsArray)
            console.log("showing",showing)
            console.log("banned",banned)
        console.groupEnd()
    }
    //Show in modal and add modal only functions
    async displayPost(findID){
        findID = Number(findID)
        //Find post from Array
        const post = this.postsArray.find(post => post.id === findID);
        if(!post){
            return
        }
        window.history.pushState({},'',`?id=${findID}`)
        //Do this if it in mobile version
        if(window.innerWidth<500){
            const clickedPost = document.getElementById(`post-${post.id}`);
            clickedPost.classList.add('expand')
        //or this if in pc version
        }else{
            let errorMessage
            //Get html, render and show post
            const newHtml = await this.createHtml([post],1)
            modalObject.modalDisplay.innerHTML=newHtml
            modalObject.modalContainer.classList.remove('hide-modal')
            const imgZoomContainer = modalObject.modalContainer.querySelector('#modal-image-zoom')
            console.log(modalObject.modalContainer)
            const orgImage = modalObject.modalContainer.querySelector('#original-image')
            console.log("orgImage",orgImage)    
            orgImage.addEventListener('click',()=>imgZoomContainer.classList.toggle('d-none'))
            imgZoomContainer.addEventListener('click',()=>imgZoomContainer.classList.toggle('d-none'))
            this.addButtonClicks(post,modalObject.modalDisplay)
        }
    }
    addButtonClicks(post,target){

            //Add listener to form
            const commentForm = target.querySelector('.form-container') 
            commentForm.addEventListener('submit',async (event) =>{
                event.preventDefault()
                await formHandler.comment(event.target)
                    target.scrollIntoView({ behavior: 'smooth' });

                // await this.updatePosts()
                // this.displayPost(Number(findID))
            });
            //Add tags clicks
            const tags = target.querySelectorAll('li')
            tags.forEach((tag)=>{
                tag.addEventListener('click',(event)=>{
                        event.preventDefault();
                        const tagText = event.target.innerText
                        window.history.pushState({}, '', 'index.html?tag='+tagText);
                        this.searchForTag(tagText)
                        modalObject.hide()
                })
            })
            //Add delete buttons to all posts owned by user
            const deletableComments = target.querySelectorAll('.delete-comment-button')
            deletableComments.forEach((comment)=>{
                comment.addEventListener('click',async (event)=>{
                    const IDs = event.target.id.split('-');
                    const response = await api.call('',`${api.postsEndpoint}/${IDs[1]}/comment/${IDs[2]}`,api.deleteApi)
                    if(response.ok){
                        await this.updatePosts()
                        this.displayPost(Number(IDs[1]))
                    }else{
                        errorMessage=await api.getErrorJson(response,'delete comment')
                    }
                })
            })
            //Add post edit button if user owns post
            if (this.user === post.author.name) {
                const editButton = target.querySelector('.edit-button')         
                editButton.addEventListener("click", (event) =>{
                    event.preventDefault()
                    formHandler.editThis(post)
                    formHandler.hideModal()
                });
                const deleteButton = target.querySelector('.delete-button')       
                deleteButton.addEventListener("click", (event) =>{
                    event.preventDefault()
                    this.deletePost(post.id)
                });
            }
    }
    async searchForTag (filterBy){
        this.updatePosts(false,false,'&_tag='+filterBy)
    }
    async deletePost(id){
        id = id ? id : Number(PostForm.container.querySelector('#postID').value)
        const response = await api.call("",api.postsEndpoint+"/"+id,api.deleteApi)
        if(response.ok){
            window.history.pushState({}, '', 'index.html');
            this.updatePosts()
            formHandler.clearForms()
            formHandler.hideModal()
            formHandler.update()
        }else{
            api.getErrorJson(response,'delete post')
        }
    }
}
