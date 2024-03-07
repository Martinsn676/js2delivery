import { api } from "../js/apiCalls.mjs";



async function init(){
    const menuObject = await import("../js/menu.mjs");
    const Menu = new menuObject.default();
    Menu.addMenus()

    allProfiles.setup();
    allProfiles.addProfiles()
}

init()
export const allProfiles = {
    setup() {
        this.container = document.getElementById('profile-page');
    },
    async addProfiles(){
        const respons = await api.call('',api.profileEndPoint,api.getApi)
        
        
        if(respons.ok){
const json = await respons.json()
            this.createHTML(json.data)
        }else{
            errorMessage=await api.getErrorJson(respons,'load all profiles')
        }
    },
    createHTML(data){
        console.log(data[0])
        let html = ""
        data.forEach(element => {
            html+=this.template(element)
        });
    console.log(html)
        this.container.innerHTML=html
    },
    template({name,avatar}){
        return `
            <a href="/profile/index.html?user=${name}" class="flex-row align">
                <div class="profile-image-container">
                    <img src="${avatar.url}">
                </div>
                ${name}
            </a>
            `
    }
};
