export default class Tag {
    constructor(){
        this.tags=[]
    }
    toggleTag(text){
        console.log("toggle tag",text)
        let newArray = []
        let existing = false
        this.allTags=document.querySelector('.tags-list').querySelectorAll('li')
        if(text!=""){
            for(let i = 0; i < this.allTags.length; i++){
                if(this.allTags[i].innerText!=text){
                    newArray.push(this.allTags[i].innerText)
                }else{
                    existing = true
                }
            }
            if(this.allTags.length===0 || !existing){
                newArray.push(text)
            }
            this.update(newArray)
        }
    }
    //Update tags container
    update(tags){
        tags = tags ? tags : this.tags
        let html = ''
        tags.forEach(tag=>{
               html+=`<li>${tag}</li>`
        })
        this.tagsLists = document.querySelectorAll('.tags-list')
        this.tagsLists.forEach((list)=>{
            list.innerHTML=html
            this.allTags = list.querySelectorAll('li')
            this.allTags.forEach(tag=>{
                tag.addEventListener('click',(target)=>{
                    this.toggleTag(target.explicitOriginalTarget.innerText)
                });
            });
        })
    }
    addTag(event){
        event.preventDefault()
        const inputField = event.target.parentElement.querySelector('#tagInput')
        const value = inputField.value
        inputField.value=""
        this.toggleTag(value)
    }
}

