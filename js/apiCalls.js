const baseUrl = 'https://v2.api.noroff.dev'
const logInEndPoint = '/auth/login'
const createEndpoint  = '/auth/register'
const getApiKeyEndpoint = '/auth/create-api-key'
const postsEndpoint = '/social/posts'
const profileEndPoint = '/social/profiles'
const searchEndpoint = '/social/posts/search?q='
const getApi = 'GET'
const postApi = 'POST'
const deleteApi = 'DELETE'
const putApi = 'PUT'
/**
 * 
 * @param {any} data String for search, number to target post, object to post forms
 * @param {string} endPoint use the variable that gives the correct endpoint (located in apiCalls.js)
 * @param {string} method the Method needed
 * @returns {response}
 */
async function apiCall(data,endPoint,method,endUrl) {
    const postData = {}
    let url = ""
    if(data==="testMode"){
        console.log("Api test mode")
        url = endPoint
        postData.method=method
    }else{
        url = baseUrl + endPoint;
        method = method ? method : "GET"
        data = data ? data : ""
        if(endPoint===searchEndpoint){
            if(data.length>0){
                url+=data+"&"
            }else{
                url = baseUrl + postsEndpoint+"?"
            }
        }

        url = endUrl ? url + endUrl : url
        postData.method = method
        //Send body if object provided
        if(typeof data === 'object'){
            postData.body = JSON.stringify(data);
        }
    }
    let accesstoken = await getLocal('accesstoken')
    accesstoken = accesstoken ? `Bearer ${accesstoken}`: "";
    let apiKey = await getLocal('apiKey')
    apiKey = apiKey ? apiKey: "";
    postData.headers = {
        'Content-Type': 'application/json',
        'Authorization': accesstoken,
        "X-Noroff-API-Key": apiKey,
        };
    console.log(url,postData)
    response = await fetchApi(url, postData)
    return response
}
async function fetchApi(url, postData){
    try {
        console.log("Fetching:",url, postData)
        const response = await fetch(url, postData);
        return response        
    } catch (error) {
        console.error("Error occurred:", error);
        return null; // or throw error if needed
    }

}
async function getErrorJson(respons,origin){
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