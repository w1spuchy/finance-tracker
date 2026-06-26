import {GetAuthorizedUser, initAuth, initNotAuth} from "./utils/checkAuth.js";
document.addEventListener("DOMContentLoaded", async () =>{
    const user = await GetAuthorizedUser();
    if(!user)
    {   
        initNotAuth();
        return
    };
    initAuth(user);
})