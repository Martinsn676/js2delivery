
import PostImport from "../js/loadPosts.mjs"

const Post = new PostImport

export const formHandler = {
    async setup(){
        this.PostFormImport = await import("./postForms.mjs");
        this.PostForms=[]
        this.update()
    },
    async addForm(target){
        const PostFormImport = await import("./postForms.mjs");
        this.PostForms.push(await new PostFormImport.default(target));
        console.log(this.PostForms)
    },
    clearForms(){
        this.PostForms.forEach((form)=>{
            form.clearForm()
            this.update()
        })
    },
    update(preLoaded){
        Post.updatePosts(preLoaded)
    },
    activateForm(){
        this.PostForms.forEach((form)=>{
            form.container.classList.add('edit-mode')
        })
    },
    async editThis(id){
        this.PostForms.forEach((form)=>{
            form.editThis(id)
        })
    }
}
formHandler.setup()