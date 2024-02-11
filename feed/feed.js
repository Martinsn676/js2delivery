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
async function addPosts(search){
    const feedContainer = document.getElementById(`feedContainer`);
    const response = await apiCall(search,searchEndpoint,getApi)
    const json = await response.json();
    const postsArray = json.data

    let editText = ""
    let html = ""

    console.log("posts:",postsArray)
    postsArray.forEach(post => {
        if(post.created!=post.updated){
            editText=' (edited)'
        }
        if(post.media){
                html+=`
                <div id="post${post.id}" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                    <h3 class="title">${post.title}</h3>
                    <p class="fs-6 text">${post.body}</p>
                    <span>${cleanDate(post.created)}${editText}</span>
                    <img class="col-12 img" src='${post.media.url}'>
                    <button class="btn btn-primary col-6 m-2" onclick="deleteThis('${post.id}')">Delete!</button>
                    <button class="btn btn-primary col-6 m-2" onclick="editThis('${post.id}')">Edit!</button>
                </div>
                `
        }
        });
    feedContainer.innerHTML=html
}

/**
 * Delete this post and refresh posts
 * @param {*} id of postfor sending delete api
 * await deleteApi(`${postsEndpoint}/${id}`)
 * addPosts() 
 */
async function deleteThis(id){
    const response = await apiCall(id,postsEndpoint,deleteApi)
    const json = await  response.json()
    console.log(json)
    addPosts()
}

addPosts()

function editThis(id) {
console.log(id)
    activateForm('edit')
    const formTarget = document.getElementById('post-form')
    const post = document.querySelector(`#post${id}`);

    const url = post.querySelector('.img').src
    const title = post.querySelector('.title').innerText
    const text = post.querySelector('.text').innerText
    const imageUrlInput = formTarget.querySelector('#imageUrlInput');
    const titleInput = formTarget.querySelector('#titleInput');
    const textInput = formTarget.querySelector('#textInput');
    const postID = formTarget.querySelector('#postID')
    imageUrlInput.value = url;
    titleInput.value = title;
    textInput.value = text;
    postID.value = id;

    activateForm('edit')
    updateImagePreview()
}