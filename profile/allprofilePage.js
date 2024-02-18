
console.log("asd")


const allProfiles = {
    setup() {
        this.container = document.getElementById('all-profiles-container');
    },
    async addProfiles(){
        const respons = await apiCall('',profileEndPoint,getApi)
        const json = await respons.json()
        this.createHTML(json.data)
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
