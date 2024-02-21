import { local } from "./global.mjs";

export const api = {
    
    'baseUrl' : 'https://v2.api.noroff.dev',
    'logInEndPoint' : '/auth/login',
    'createEndpoint'  : '/auth/register',
    'getApiKeyEndpoint' : '/auth/create-api-key',
    'postsEndpoint' : '/social/posts',
    'profileEndPoint' : '/social/profiles',
    'searchEndpoint' : '/social/posts/search?q=',
    'getApi' : 'GET',
    'postApi' : 'POST',
    'deleteApi' : 'DELETE',
    'putApi' : 'PUT',
    /**
    * Make an api call
    * @param {any} data String for search, number to target post, object to post forms
    * @param {string} endPoint use the variable that gives the correct endpoint (located in apiCalls.js)
    * @param {string} method the Method needed
    * @param {array} endUrl url string to add
    * @returns {response}
    */
    async call(data,endPoint,method,endUrl) {
    const postData = {}
    let url = ""

    url = this.baseUrl + endPoint;
    method = method ? method : "GET"
    data = data ? data : ""
    if(endPoint===api.searchEndpoint){
        if(data.length>0){
            url+=data+"&"
        }else{
            url = this.baseUrl + this.postsEndpoint+"?"
        }
    }

    url = endUrl ? url + endUrl : url
    postData.method = method
    //Send body if object provided
    if(typeof data === 'object'){
        postData.body = JSON.stringify(data);
    }
    
    let accesstoken = await local.get('accesstoken')
    accesstoken = accesstoken ? `Bearer ${accesstoken}`: "";
    let apiKey = await local.get('apiKey')
    apiKey = apiKey ? apiKey: "";
    postData.headers = {
        'Content-Type': 'application/json',
        'Authorization': accesstoken,
        "X-Noroff-API-Key": apiKey,
        };
    console.log(url,postData)
    const response = await this.fetchApi(url, postData)
    return response
    },
    async fetchApi(url, postData){
        try {
            console.log("Fetching:",url, postData)
            const response = await fetch(url, postData);
            return response        
        } catch (error) {
            console.error("Error occurred:", error);
            return null; // or throw error if needed
        }

    },
    async getErrorJson(respons,origin){
        const json = await respons.json()
        const errors = json.errors
        origin = origin ? origin : 'No manual origin'
        let errorMessages = ""
        errors.forEach(error => {
            errorMessages+=error.message+"!"
        });
        console.warn(errorMessages)
        console.log('Origin of error:',origin)
        console.trace()
        return errorMessages
    }
}