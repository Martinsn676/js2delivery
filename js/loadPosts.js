// Render the posts and replace the old ones
/**
 * //Get posts from api call and render them
 * @param {string} search optional search string
 * ```js
 *  const feedContainer = document.getElementById(`feedContainer`);
 *  const response = await getApi(postsEndpoint)
 *  const postsArray = apiResponse.data
 * ```
 */
const modalObject = {
    //Variables used, but set later
    'modalContainer':"",
    'modalBackground':"",
    'modalDisplay':"",
    setup(){
        this.modalContainer = document.getElementById('modal')
        this.modalBackground = this.modalContainer.querySelector('.modal-back-ground')
        this.modalDisplay = this.modalContainer.querySelector('.modal-display')
        this.modalBackground.addEventListener('click',()=>{
            // Clear the end of the URL
            window.history.pushState({}, '', 'index.html');
            console.log("hide modal")
            this.modalContainer.classList.add('hide-modal')

        })
    },
    show(){
        this.modalContainer.classList.remove('hide-modal')
    },
    hide(){
        this.modalContainer.classList.add('hide-modal')
    }
}
const postsObject = {
    'settings':{
        'endApi':'_author=true&_comments=true&_reactions=true'
    },
    //Variables used, but set later
    'user':"",
    'container':"",
    'postsArray':[],
    setUp(){
        this.container=document.getElementById(`feedContainer`)
        this.user=getUserName()
    },

    async updatePosts(search,filter){
        search = search ? search :""
        filter = filter ? filter :""
        let searchResult = "Showing all posts"
        const response = await apiCall(search, searchEndpoint, getApi, this.settings.endApi+filter);
        const json = await response.json();
        const postsArray = json.data
        this.addPosts(postsArray)
        const searchResultContainer = document.getElementById('searchResultContainer')
        if(search!=""){
            searchResult="Showing search result for "+search
        }
        if(filter!=""){
            const splitFilter = filter.split('=');
            searchResult="Showing posts with the tag: "+splitFilter[1]
        }
        if(searchResultContainer){
            searchResultContainer.innerHTML=searchResult
            urlID = getUrlParam('id')
            if(urlID!=false){
                this.displayPost(urlID)
            }
        }
    },
    async addPosts(postsArray){
        const html = await this.createHtml(postsArray)
        feedContainer.innerHTML = ""
        feedContainer.innerHTML = html
        // this.container.insertAdjacentHTML("beforeend", html);
        this.postsArray=postsArray
        this.addFunctions(postsArray)
    },
    async createHtml(postsArray){
        let html = ""
        postsArray.forEach((post) => {
            if(post){
                let editText = "";
                let tagHtml = "";
                let editButton = "";
                let commentHtml = ""
                let reactiosnHtml =""
                const { _count,title,body,created, updated, media, tags, author,id,comments,reactions } = post;
                if (created != updated) {
                    editText = ' (edited)';
                }
                if (tags) {
                    tags.forEach(tag => {
                        tagHtml += `<li>${tag}</li>`;
                    });
                }
                if (this.user === author.name) {
                    editButton = `                   
                        <button id="edit-button-${id}" class="only-expanded edit-button icon-button"><i class="bi bi-pencil-fill"></i></button>
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
                if(reactions){
                    for(let i = 0 ; i < reactions.length; i++){
                        if(reactions[i].reactors.find(reactor => reactor === this.user)){
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
                const url = media ? media.url : '';
                if(media){
                    html += `
    <div id="post-${id}" class="media-post-container">
        <div class="media-post flex-row">
            <div class="flex-column left-side">
                <div class="text-box">
                    <h3 class="title">${title}</h3>
                    <p class="fs-6 text">${body}</p>
                </div>
                <div class="blur"></div>
                <div class="image-container mt-2 mb-2 flex-column align">
                    <img class="img" src='${url}'>
                    ${editButton}
                </div>
                <span>${cleanDate(created)}${editText}</span>
                <ul class="tags-container list-unstyled">${tagHtml}</ul>
                <div class="flex-row flex-spread">
                    <div class="hide-modal">
                        <i class="bi bi-chat-left"></i>
                        <span>${_count.comments}</span>
                    </div>      
                    <div class="hide-modal">
                        <i class="bi bi-heart"></i>
                        <span>${_count.reactions}</span>
                    </div>
                </div>
            </div>
            <div class="flex-column rigth-side only-modal">
                <div class=" col-12 flex-column">
                    ${commentHtml}
                </div>
                <div class="col-12 flex-column">
                    ${reactiosnHtml}
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
    },
    addFunctions(postsArray){
        let showCount = 0
        let badQuality = 0
        let noImageCount = 0
        postsArray.forEach((post) => {
            const { id,media } = post;
            const postContainer = document.querySelector(`#feedContainer #post-${id}`);
            if(media){
                showCount++
                const mediaPost =  postContainer.querySelector('.media-post')
                mediaPost.addEventListener("click", () => this.displayPost(id));
            }else{
                noImageCount++
            }
        });
        console.groupCollapsed('Posts data',showCount+"/"+postsArray.length)
            console.log(postsArray)
            console.log("showCount",showCount)
            console.log("badQuality",badQuality)
            console.log("noImageCount",noImageCount)
        console.groupEnd()
    },
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
            const newHtml = await postsObject.createHtml([post])
            modalObject.modalDisplay.innerHTML=newHtml
            modalObject.modalContainer.classList.remove('hide-modal')

            //Add listener to form
            const commentForm = modalObject.modalContainer.querySelector('.form-container') 
            commentForm.addEventListener('submit',async (event) =>{
                await submitPostForm(event)
                await this.updatePosts()
                this.displayPost(Number(findID))
            });
            //Add tags
            const tags = modalObject.modalContainer.querySelectorAll('li')
            tags.forEach((tag)=>{
                tag.addEventListener('click',(event)=>{
console.log("tag clicked")
                    event.preventDefault();
                    window.history.pushState({}, '', 'index.html');
                    this.searchForTag(event.target.innerText)
                    
                    modalObject.hide()
                })
            })
            //Add listener to like button
            // const heartIcon = modalObject.modalContainer.querySelector('#heartIcon')
            // heartIcon.addEventListener('click',async ()=>{
            //     const response = await apiCall('',postsEndpoint,putApi,`/${findID}/react/👍`)
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
                    const response = await apiCall('',postsEndpoint,deleteApi,`/${IDs[1]}/comment/${IDs[2]}`)
                    if(response.ok){
                        await this.updatePosts()
                        this.displayPost(Number(IDs[1]))
                    }else{
                        errorMessage=await getErrorJson(response,'delete comment')
                    }
                })
            })
            //Add post edit button if user owns post
            if (this.user === post.author.name) {
                const editButton = modalObject.modalDisplay.querySelector('.edit-button')         
                editButton.addEventListener("click", () =>{
                    formObject.editThis(post)
                    modalObject.modalContainer.classList.add('hide-modal')
                    modalObject.modalDisplay.innerHTML=""
                });
            }
        }
    },
    async searchForTag (filterBy){
        console.log(filterBy)
        this.updatePosts('','&_tag='+filterBy)
    },
    async deletePost(id){
        id = id ? id : Number(formObject.container.querySelector('#postID').value)
        const response = await apiCall("",postsEndpoint,deleteApi,"/"+id)
        if(response.ok){
            window.history.pushState({}, '', 'index.html');
            this.updatePosts()
            formObject.clearForm()
        }else{
            getErrorJson(response,'delete post')
        }
    },
}



