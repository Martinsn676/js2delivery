
const profile = {
    'profilePage':document.getElementById('profile-page'),
    'userName':getUserName(),
    'userData':[],
    async setup(){
        const respons = await apiCall('',profileEndPoint,getApi,'/'+this.userName)
        const json = await respons.json()    
        this.userData = json.data
        console.log(this.userData)
        this.profilePage.innerHTML=this.template(this.userData)
        const postRespons = await apiCall('',profileEndPoint+"/"+this.userName+"/posts"+"?",getApi, postsObject.settings.endApi)
        const jsonPosts = await postRespons.json()

        postsObject.addPosts(jsonPosts.data)     
        profile.addFunctions()
    },
    template({avatar,banner,bio,email,name}){
//<div id="banner-image" style="background-image: url('${banner.url}');">
        return `
    <div class="flex-column">
        <div id="banner-container">
            <img src="${banner.url}">
            <button id="" class="edit-button icon-button">
                <i class="bi bi-pencil-fill"></i>
            </button>
        </div>
        <div class="flex-row">
            <div class="left-side col-6">

                <div id="image-container" class="">
                    <button id="" class="edit-button icon-button">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <img id="profile-image" src="${avatar.url}">
                </div>
            </div>
            <div class="right-side col-6">
                <div class="">
                    <h3>${name}</h3>
                    <p>${bio}</p>
                </div>
            </div>
        </div>
    </div>

        `
    },
    addFunctions(){
        const bannerImage = document.querySelector('#banner-container .edit-button')
        bannerImage.addEventListener('click',()=>{
            this.editImage('banner')
        })
        const profileImage = document.querySelector('#image-container  .edit-button')
        profileImage.addEventListener('click',()=>{
            this.editImage('profile')
        })
    },
    editImage(editing){
        modalObject.modalDisplay.innerHTML=this.changeImageForm()
        modalObject.show()
        const submitButton = modalObject.modalDisplay.querySelector('button')
        submitButton.addEventListener('click',async ()=>{
            event.preventDefault()
            newUrl = modalObject.modalDisplay.querySelector('input').value
            if(newUrl!=""){
                body={}
                if(editing==='profile'){
                    body.avatar={
                            "url": newUrl,
                            "alt": "string"             
                    }
                }else if(editing==='banner'){
                    body.banner={
                            "url": newUrl,
                            "alt": "string"             
                    }
                }else{
                    return
                }

                await apiCall(body,profileEndPoint,putApi,'/'+this.userName)
            }
        })
    },
    changeImageForm(){
        return`
            <form id="change-image-form" class="form-container flex-column">
                <label for="imageUrl" class="form-label mb-2">Image url</label>
                <input required 
                    type="text" 
                    class="form-control clearable" 
                    id="imageUrlInput" 
                    name="imageUrl" 
                    value=""
                />
                <button type="submit">Change image</button>
            </form>
        `
    }

}
profile.setup()