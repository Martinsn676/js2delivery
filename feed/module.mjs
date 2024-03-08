

// document.addEventListener("DOMContentLoaded", async function() {
async function init(){
    const menuObject = await import("../js/menu.mjs");
    const Menu = new menuObject.default();
    Menu.addMenus()
    //await postsObject.updatePosts();
    // const id = getUrlParam('id')
    // if(id){
    //     postsObject.displayPost(id)
    // }
}
init()
