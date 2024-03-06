import { getUserName,getUrlParam  } from "./global.mjs"
import { api } from "./apiCalls.mjs"


const Modal = await import("./modal.mjs");
const modalObject = new Modal.default();

const PostFormImport = await import("./postForms.mjs");
const PostForm = new PostFormImport.default();

export default class Post {
    constructor(){
        this.settings = {
            'endApi':'_author=true&_comments=true&_reactions=true'
        }
        this.container=document.getElementById(`feedContainer`)
        this.user=getUserName()
        this.postsArray = []
    }

    async updatePosts(search,filter){
        search = search ? search :""
        filter = filter ? filter :""
        const urlFilter = getUrlParam('tag')
        filter = urlFilter ? `&_tag=${urlFilter}` : filter
        let searchResult = "Showing all posts"
        const response = await api.call(search, api.searchEndpoint, api.getApi, this.settings.endApi+filter);
        const json = await response.json();
        const postsArray = json.data
        this.addPosts(postsArray)
        const searchResultContainer = document.getElementById('searchResultContainer')
        if(search!=""){
            searchResult=`
            <div>
                Showing search result for "${search}"
            </div>
            <button id="reset-button">Reset</button>`
        }else if(filter!=""){
            const splitFilter = filter.split('=');
            searchResult="<div>Showing posts with the tag: "+splitFilter[1]+"</div>"
            searchResult+=`<button id="reset-button">Reset</button>`
        }
        if(searchResultContainer){
            searchResultContainer.innerHTML=searchResult
            const resetButton = searchResultContainer.querySelector('#reset-button')
            const inProfilePage = window.location.pathname.endsWith("/profile/index.html");
            if(resetButton){
                resetButton.addEventListener('click',()=>{
                    if(inProfilePage){
                        // const userParam = profileInfo.userData.name
                        // const user = userParam ? "?user="+userParam : ""
                        updatePosts()
                    }else{
                        const urlID = getUrlParam('id')
                        const id = urlID ? "?id="+urlID : ""
                        window.location.href="./index.html"+id
                        if(urlID!=false){
                            this.displayPost(urlID)
                        }
                    }
                })
            }           
        }
    }
    async addPosts(postsArray){
        const html = await this.createHtml(postsArray)
        feedContainer.innerHTML = ""
        feedContainer.innerHTML = html
        // this.container.insertAdjacentHTML("beforeend", html);
        this.postsArray=postsArray
        this.addFunctions(postsArray)
        PostForm.container=document.getElementById('form-container')
    }   
    //Blacklisting to hide 
    checkBlackList({ body, media }) {
        const bannedStarts = ['https://unsplash.com', 'https://ibb', 'https://url', 'Lorem'];

        // Using a for...of loop
        for (const banned of bannedStarts) {
            if (!media || media.url.startsWith(banned) || body.startsWith(banned)) {
                return true;
            }
        }

        return false;
    }

    async createHtml(postsArray){
        let html = ""
        postsArray.forEach((post) => {
            if(post){
                const { _count,title,body,created, updated, media, tags, author,id,comments,reactions } = post;
                let editText = "";
                let tagHtml = "";
                let editButton = "";
                let commentHtml = ""
                let reactiosnHtml =""
                let authorString = author.name
                
                if (created != updated) {
                    editText = ' (edited)';
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
                    editButton = ` 
                        <div id="edit-post-nav" class="only-modal">                  
                            <button id="edit-post-button-${id}" class="only-expanded edit-button icon-button m-1"><i class="bi bi-pencil-fill"></i></button>
                            <button id="delete-post-button-${id}" class="only-expanded delete-button icon-button m-1"><i class="bi bi-trash-fill"></i></button>
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

                if(!this.checkBlackList(post)){

                    const date = new Date(created)

                    html += `
    <div id="post-${id}" class="media-post-container">
        <div class="media-post flex-row">
            <div class="flex-column left-side flex-spread">
                <div class="text-box">
                    <a class="post-author" href="/profile/index.html?user=${author.name}">@${authorString}</a>
                    <h3 class="title">${title}</h3>
                    <span>${date.toLocaleDateString()}${editText}</span>
                    <p class="fs-6 text">${body}</p>
                </div>
                <div class="blur"></div>
                
                <div class="image-container mt-2 mb-2 flex-column align">
                    <img class="img" src='${url}'>
                    ${editButton}
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
            </div>
            <div class="flex-column rigth-side only-modal">
                <div class=" col-12 flex-column">
                    ${commentHtml}
                </div>
                <form class="form-container col-12 flex-column comment">
                    <input 
                        type="text" 
                        class="d-none clearable" 
                        id="postID" 
                        name="postID" 
                        value="${id}"
                    />
                    <textarea 
                        id="textInput" 
                        name="text" 
                        class="mb-2 
                        form-control clearable border-primary" 
                        rows="2" 
                        placeholder="Write a comment"
                    ></textarea>
                    <button type="submit" >Comment!</button>
                </form> 
            </div>
        </div>
    </div>`
                }
            }
            });
            return html
    }
    addFunctions(postsArray){
        let showCount = 0
        let badQuality = 0
        let noImageCount = 0
        postsArray.forEach((post) => {
            const { id,media } = post;
            const postContainer = document.querySelector(`#feedContainer #post-${id}`);
            if(this.checkBlackList(post)){
                noImageCount++
            }else{
                showCount++
                const mediaPost =  postContainer.querySelector('.media-post')
                mediaPost.addEventListener("click", (event) =>{
                if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON' || event.target.tagName === 'LI' || event.target.tagName === 'I') {
                    // If it is, do nothing (stop propagation)
                    return;
                }
                    this.displayPost(id)
                });
                //Add tags clicks
                const tags = mediaPost.querySelectorAll('.tag')
                tags.forEach((tag)=>{
                    tag.addEventListener('click',(event)=>{
                        event.preventDefault();
                        const tagText = event.target.innerText
                        window.history.pushState({}, '', 'index.html?tag='+tagText);
                        this.searchForTag(tagText)
                        modalObject.hide()
                    })
                })
            }
        });
        console.groupCollapsed('Posts data',showCount+"/"+postsArray.length)
            console.log(postsArray)
            console.log("showCount",showCount)
            console.log("badQuality",badQuality)
            console.log("noImageCount",noImageCount)
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
            //Get html, render and show post
            const newHtml = await this.createHtml([post])
            modalObject.modalDisplay.innerHTML=newHtml
            modalObject.modalContainer.classList.remove('hide-modal')

            //Add listener to form
            const commentForm = modalObject.modalContainer.querySelector('.form-container') 
            commentForm.addEventListener('submit',async (event) =>{
                await submitPostForm(event)
                await this.updatePosts()
                this.displayPost(Number(findID))
            });
            //Add tags clicks
            const tags = modalObject.modalContainer.querySelectorAll('li')
            tags.forEach((tag)=>{
                tag.addEventListener('click',(event)=>{
                        event.preventDefault();
                        const tagText = event.target.innerText
                        window.history.pushState({}, '', 'index.html?tag='+tagText);
                        this.searchForTag(tagText)
                        modalObject.hide()
                })
            })
            //Add listener to like button
            // const heartIcon = modalObject.modalContainer.querySelector('#heartIcon')
            // heartIcon.addEventListener('click',async ()=>{
            //     const response = await api.call('',postsEndpoint,putApi,`/${findID}/react/👍`)
            //     console.log(findID)
            //         if(response.ok){
            //             await this.updatePosts()
            //             this.displayPost(Number(findID))
            //         }else{
            //             errorMessage=await getErrorJson(response,'react to post')
            //         }
            // })

            //Add delete buttons to all posts owned by user
            const deletableComments = modalObject.modalDisplay.querySelectorAll('.delete-comment-button')
            deletableComments.forEach((comment)=>{
                comment.addEventListener('click',async (event)=>{
                    const IDs = event.target.id.split('-');
                    const response = await api.call('',api.postsEndpoint,api.deleteApi,`/${IDs[1]}/comment/${IDs[2]}`)
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
                    const editButton = modalObject.modalDisplay.querySelector('.edit-button')         
                    editButton.addEventListener("click", (event) =>{
                        event.preventDefault()
                        PostForm.editThis(post)
                        modalObject.modalContainer.classList.add('hide-modal')
                        modalObject.modalDisplay.innerHTML=""
                    });
                    const deleteButton = modalObject.modalDisplay.querySelector('.delete-button')       
                    deleteButton.addEventListener("click", (event) =>{
                        event.preventDefault()
                        this.deletePost(post.id)
                        modalObject.modalContainer.classList.add('hide-modal')
                        modalObject.modalDisplay.innerHTML=""
                    });
                }

        }
    }
    async searchForTag (filterBy){
        console.log(filterBy)
        this.updatePosts('','&_tag='+filterBy)
    }
    async deletePost(id){
        id = id ? id : Number(PostForm.container.querySelector('#postID').value)
        const response = await api.call("",api.postsEndpoint,api.deleteApi,"/"+id)
        if(response.ok){
            window.history.pushState({}, '', 'index.html');
            this.updatePosts()
            PostForm.clearForm()
        }else{
            api.getErrorJson(response,'delete post')
        }
    }
}
