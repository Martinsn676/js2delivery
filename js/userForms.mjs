import { api } from "./apiCalls.mjs";

const LocalImport = await import("./localSave.mjs");
const Local = new LocalImport.default();

const allUserForms = document.querySelectorAll('form')
allUserForms.forEach(form => {
  form.addEventListener('submit', (event) => submitForm(event));
    const passwordInput2 = form.querySelector('#passwordInput2');
    if(passwordInput2){
        passwordInput2.addEventListener('keyup',()=>{
            const inputContainer = passwordInput2.closest('.form-part'); 
            if(passwordMatches(form)){
                inputContainer.classList.remove('is-invalid');
                inputContainer.classList.add('is-valid');
            }else{
                inputContainer.classList.add('is-invalid');
                inputContainer.classList.remove('is-valid');
                console.log("match")
            }
        });
    }
});
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(noroff\.no|stud\.noroff\.no)$/; 
    return emailRegex.test(email);
}
function passwordMatches(form){
    const passwordInput = form.querySelector('#passwordInput');
    const passwordInput2 = form.querySelector('#passwordInput2');
    if(!passwordInput2){
        return true
    }else if(passwordInput.value===passwordInput2.value){
        return true
    }
}
async function submitForm(event) {
    event.preventDefault();
    const formTarget = event.target;
    const formID = event.target.id
    const errorMessageText = formTarget.querySelector('.error-message')
    errorMessageText.classList.add('d-none')

    const emailInput = formTarget.querySelector('.email-input');



    if (formTarget.checkValidity() && isValidEmail(emailInput.value)) {
        const allFormParts = formTarget.querySelectorAll('.form-part');
        allFormParts.forEach(part => {

            part.classList.remove('is-invalid');
            part.classList.add('is-valid');
        })
        //User releated input
        const nameInput = formTarget.querySelector('.username-input');
        const name = nameInput ? nameInput.value : "";

        const passwordInput = formTarget.querySelector('.password-input');
        const passwordInput2 = formTarget.querySelector('.password-input-2');
        if(passwordInput2 && passwordInput===passwordInput2){

        }
        const password = passwordInput ? passwordInput.value : false; 
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
        } else {
            const invalidInputs = formTarget.querySelectorAll(':invalid');
            invalidInputs.forEach(input => {
                const inputContainer = input.closest('.form-part'); 
                if (inputContainer) {
                    inputContainer.classList.remove('is-valid');
                    inputContainer.classList.add('is-invalid');
                }
            });

            const validInputs = formTarget.querySelectorAll(':valid');
            validInputs.forEach(input => {
                const inputContainer = input.closest('.form-part'); 
                if (inputContainer) {
                    inputContainer.classList.remove('is-invalid');
                    inputContainer.classList.add('is-valid');
                }
            });
            //Direct check for regex in form didnt work
            if(isValidEmail(emailInput.value)){
                const inputContainer = emailInput.closest('.form-part'); 
                if (inputContainer) {
                    inputContainer.classList.remove('is-invalid');
                    inputContainer.classList.add('is-valid');
                }
            }else{
                const inputContainer = emailInput.closest('.form-part'); 
                if (inputContainer) {
                    inputContainer.classList.remove('is-valid');
                    inputContainer.classList.add('is-invalid');
                }
            }
        }

}
