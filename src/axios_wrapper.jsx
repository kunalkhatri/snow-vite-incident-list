import axios from "axios"
const instance = import.meta.env.VITE_INSTANCE;
const auth_mode = import.meta.env.VITE_AUTHENTICATON;
let request;
console.log(typeof auth_mode, auth_mode);

if (auth_mode=="basic"){
    console.log("BASIIC");
    request = function (params) {
        let parameters = params;
        parameters.auth = {
            username:import.meta.env.VITE_AUTH_USERNAME,
            password:import.meta.env.VITE_AUTH_PASSWORD
        };
        parameters.withCredentials = true;

        return axios(parameters);
    }
}
else {
    request = function(params){
        let parameters = params;
        parameters.headers =  params.headers? { 'X-UserToken':window.servicenowUserToken, ...params.headers}:{ 'X-UserToken':window.servicenowUserToken};
        return axios(parameters);
    }
}


export default request;