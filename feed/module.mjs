import { postsObject,modalObject } from "../js/loadPosts.mjs";

document.addEventListener("DOMContentLoaded", function() {

        postsObject.updatePosts();
        modalObject.setup()
    });