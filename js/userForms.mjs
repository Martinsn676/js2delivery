import { api } from "./apiCalls.mjs";

const LocalImport = await import("./localSave.mjs");
const Local = new LocalImport.default();

const allUserForms = document.querySelectorAll('form')
allUserForms.forEach(form => {
  form.addEventListener('submit', (event) => submitForm(event));
});

async function submitForm(event) {
    let testMode = true;

    event.preventDefault();
    const formTarget = event.target;
    const formID = event.target.id
    const errorMessageText = formTarget.querySelector('#errorMessageText')
    errorMessageText.classList.add('d-none')
    if (formTarget.checkValidity()) {
        const allFormParts = formTarget.querySelectorAll('.form-part');
        allFormParts.forEach(part => {

            part.classList.remove('is-invalid');
            part.classList.add('is-valid');
        })
        //User releated input
        const nameInput = formTarget.querySelector('#usernameInput');
        const name = nameInput ? nameInput.value : "";

        const passwordInput = formTarget.querySelector('#passwordInput');
        const password = passwordInput ? passwordInput.value : false;

        const emailInput = formTarget.querySelector('#emailInput');
        const email = emailInput ? emailInput.value : false;


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
                    Local.save('accesstoken',json.data.accessToken)
                    Local.save('userName',json.data.name)
                    const keyResponse = await api.call(data,api.getApiKeyEndpoint,api.postApi)
                    const jsonKeyRepsonse = await keyResponse.json()
                    Local.save('apiKey',jsonKeyRepsonse.data.key)
                    window.location.href = '../feed/index.html'
                }else{
                    errorMessage=json.errors[0].message
                    console.warn("login failed:",json.errors[0].message)
                }
            }
        }
        if(errorMessage!=""){
            console.log(errorMessage)
            errorMessageText.innerText=errorMessage;
            errorMessageText.classList.remove('d-none')
        }
    }else{
        const invalidInputs = formTarget.querySelectorAll(':invalid');
        invalidInputs.forEach(input => {
            const inputContainer = input.closest('.form-part'); // Adjust selector as needed
            if (inputContainer) {
                inputContainer.classList.remove('is-valid');
                inputContainer.classList.add('is-invalid');
            }
        });
        const validInputs = formTarget.querySelectorAll(':valid');
        validInputs.forEach(input => {
        const inputContainer = input.closest('.form-part'); // Adjust selector as needed
        if (inputContainer) {
            inputContainer.classList.remove('is-invalid');
            inputContainer.classList.add('is-valid');
        }
    });
    }
}
