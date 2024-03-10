const LocalImport = await import("./localSave.mjs");
const Local = new LocalImport.default();
export const api = {
    'baseUrl' : 'https://v2.api.noroff.dev',
    'logInEndPoint' : '/auth/login',
    'createEndpoint'  : '/auth/register',
    'getApiKeyEndpoint' : '/auth/create-api-key',
    'postsEndpoint' : '/social/posts',
    'profileEndPoint' : '/social/profiles',
    'searchEndpoint' : '/social/posts/search?q=',
    'allPostDetails':'_author=true&_comments=true&_reactions=true',
    'allProfileDetails':'_following=true&_followers=true&_posts=true',
    'getApi' : 'GET',
    'postApi' : 'POST',
    'deleteApi' : 'DELETE',
    'putApi' : 'PUT',
    /**
    * Make an api call
    * @param {any} data String for search, number to target post, object to post forms
    * @param {string} endPoint use the variable that gives the correct endpoint (located in apiCalls.js)
    * @param {string} method the Method needed
    * @param {array} endUrl url string to add after ? 
    * @returns {response}
    */
    async call(data,endPoint,method,endUrl) {
        const postData = {
            'method':method
        }
        console.log(data,endPoint,method,endUrl)
        let url = this.baseUrl + endPoint
        method = method ? method : "GET"
        data = data ? data : ""
        if(endPoint===api.searchEndpoint){
            url = data.length>0 ? `${url+data}&${endUrl}`:`${this.baseUrl+this.postsEndpoint}?` 
        }else{
            url = endUrl ? `${url}?${endUrl}` : url;
        }
        //Send body if object provided
        if(typeof data === 'object'){
            postData.body = JSON.stringify(data);
        }
        
        let accesstoken = await Local.get('accesstoken')
        accesstoken = accesstoken ? `Bearer ${accesstoken}`: "";
        let apiKey = await Local.get('apiKey')
        apiKey = apiKey ? apiKey: "";
        postData.headers = {
            'Content-Type': 'application/json',
            'Authorization': accesstoken,
            "X-Noroff-API-Key": apiKey,
            };

        const response = await this.fetchApi(url, postData)
        return response
    },
    /**
     * Fetch the api
     * @param {string} url created in call()
     * @param {object} postData created in call()
     * @returns response
     */
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
    /**
     * 
     * @param {respons} respons of the api call
     * @param {string} origin manual text to explain action
     * @returns 
     */
    async getErrorJson(respons,origin){
        const json = await respons.json()
        const errors = json.errors
        origin = origin ? origin : 'No manual origin'
        let errorMessages = ""
        errors.forEach(error => {
            errorMessages+=error.message+"!"
        });
        console.warn(errorMessages)
        console.log(json)
        console.log('Origin of error:',origin)
        console.trace()
        return errorMessages
    }
}