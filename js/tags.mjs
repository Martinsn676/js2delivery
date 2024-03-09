export default class Tag {
    constructor(){
        this.tags=[]
    }
    /**
     * Submit tag to be added
     * @param {event} event 
     */
    addTag(event){
        event.preventDefault()
        const inputField = event.target.parentElement.querySelector('#tagInput')
        const value = inputField.value
        inputField.value=""
        this.toggleTag(value)
    }
    /**
     * Toggle the tag, then update
     * @param {string} text 
     */
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
    /**
     * Update array, either upon edit post or changes
     * @param {array} tags 
     */
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

}

