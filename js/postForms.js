async function submitPostForm(event) {
    let testMode = false;
    console.log('submit!')
    event.preventDefault();
    const formTarget = event.target;

    if (formTarget.checkValidity()) {

        //Post releated inputs
        const titleInput = formTarget.querySelector('#titleInput');
        const title = titleInput ? titleInput.value : false;

        const bodyInput = formTarget.querySelector('#textInput');
        const body = bodyInput ? bodyInput.value : false;

        const idInput = formTarget.querySelector('#postID');
        const id = idInput ? Number(idInput.value) : false;

        const imageUrlInput = formTarget.querySelector('#imageUrlInput');
        const imageUrl = imageUrlInput ? imageUrlInput.value : false;
        const imageAlt = imageUrlInput ? 'User uploaded post image' : false;

        if(testMode){console.log("title:", title, "body:", body, "imageUrl:","id",id, "image",imageUrl);}
        formObject.clearWarning()

        let data = {}
        let errorMessage = ""

        // is valid post
        if(title){
            data.title=title
            data.body=body
            data.tags=tagsObject.tags
            data.media={
                'url':imageUrl,
                'alt':imageAlt,
            }
        }
        if(formTarget.classList.contains('edit-mode')){
            const response = await apiCall(data,postsEndpoint,putApi,id)
            if(response.ok){
                addPosts()
            }else{
                errorMessage=await getErrorJson(response,'edit post')
            }
        }else{
            const response = await apiCall(data,postsEndpoint,postApi)
            if(response.ok){
                addPosts()
            }else{
                errorMessage=await getErrorJson(response,'create post')
            }
        }
        if(errorMessage!=""){
            errorMessageText.innerText=errorMessage;
            errorMessageText.classList.remove('d-none')
        }else{
            formObject.clearForm()
            addPosts()
        }
    }else{
        if(testMode){console.log("failed validation")}
    }
}
