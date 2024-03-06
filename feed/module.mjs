import { getUrlParam } from "../js/global.mjs";
import { postsObject,modalObject } from "../js/loadPosts.mjs";

document.addEventListener("DOMContentLoaded", async function() {
        await postsObject.updatePosts();
        await modalObject.setup()
        const id = getUrlParam('id')
        if(id){
            postsObject.displayPost(id)
        }
    });