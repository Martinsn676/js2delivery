import { postsObject,modalObject } from "../js/loadPosts.mjs";
import { profileInfo } from "../js/profile.mjs";

document.addEventListener("DOMContentLoaded", function() {
    postsObject.setUp();
    modalObject.setup()
    profileInfo.setup()
});

