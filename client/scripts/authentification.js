import SerializeForm from "../scripts/utils/form.js";
import DisplayNotification from "./utils/notification.js";

document.addEventListener("DOMContentLoaded", async ()=>{
    const authForm = document.getElementById("authentification-form");
    authForm.addEventListener('submit', async (event)=>{
        event.preventDefault();
        const data = SerializeForm(authForm);

        const response = await fetch('http://localhost:5000/auth/login',{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": data.get("email"),
                "password": data.get("password")
            })
        });  

        const responseData = await response.json();
        
        if(Object.hasOwn(responseData, "errors"))
        {
            const errors = responseData.errors;
            DisplayNotification(errors);
            return;
        }
        
        window.location.href = "../index.html"; 
    })
})