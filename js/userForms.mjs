import { api } from "./apiCalls.mjs";
import { local } from "./global.mjs";

const allUserForms = document.querySelectorAll('form')
allUserForms.forEach(form => {
  form.addEventListener('submit', (event) => submitForm(event));
});

async function submitForm(event) {
    let testMode = true;
    
    event.preventDefault();
    const formTarget = event.target;
    const formID = event.target.id

    if (formTarget.checkValidity()) {
        //User releated input
        const nameInput = formTarget.querySelector('#usernameInput');
        const name = nameInput ? nameInput.value : "";

        const passwordInput = formTarget.querySelector('#passwordInput');
        const password = passwordInput ? passwordInput.value : false;

        const emailInput = formTarget.querySelector('#emailInput');
        const email = emailInput ? emailInput.value : false;

        if(testMode){console.log("name:", name, "password:", password, "email:", email);}
        
        const errorMessageText = formTarget.querySelector('#errorMessageText')
        errorMessageText.classList.add('d-none')

        let data = {}
        let errorMessage = ""

        // is valid user
        if(email){
            let loginNow = false
            data.email=email
            data.name=name
            data.password=password
            
            if(formID==='creatUserForm'){
                const response = await api.call(data,api.createEndpoint,api.postApi)
                const json = await response.json()
                if(response.status===201){
                    loginNow=true
                }else{
                    errorMessage=json.errors[0].message
                    console.warn("Crate account failed:",json.errors[0].message)
                }
            }
            if(formID==='loginForm' || loginNow){
                const response = await api.call(data,api.logInEndPoint,api.postApi)
                const json = await response.json()
                if(response.status===200){
                    console.log(json)
                    local.save('accesstoken',json.data.accessToken)
                    local.save('userName',json.data.name)
                    const keyResponse = await api.call(data,api.getApiKeyEndpoint,api.postApi)
                    const jsonKeyRepsonse = await keyResponse.json()
                    local.save('apiKey',jsonKeyRepsonse.data.key)
                    window.location.href = '../feed/index.html'
                }else{
                    errorMessage=json.errors[0].message
                    console.warn("login failed:",json.errors[0].message)
                }
            }
        }
        if(errorMessage!=""){
            errorMessageText.innerText=errorMessage;
            errorMessageText.classList.remove('d-none')
        }
    }else{
        if(testMode){console.log("failed validation")}
    }
}
