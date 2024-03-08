


async function init(){
    const menuObject = await import("../js/menu.mjs");
    const Menu = new menuObject.default();
    Menu.addMenus()
    const profileImport = await import("../js/profile.mjs");
    const ProfileInfo = new profileImport.default();
    ProfileInfo.render()
}

init()

