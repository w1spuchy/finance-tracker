import SerializeForm from "../scripts/utils/form.js";
import DisplayNotification from "./utils/notification.js";

document.addEventListener('DOMContentLoaded', ()=>{
    const registrationForm = document.getElementById("registration-form");
    registrationForm.addEventListener('submit', async (event)=>
    {
        event.preventDefault();
        const data = SerializeForm(registrationForm);
        if(data.get("password") != data.get("confirm"))
        {
            DisplayNotification("Пароль и подтверждение пароля не совпадают");
            return
        }

        const response = await fetch('http://localhost:5000/auth/registration',{
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                "email": data.get("email"),
                "password": data.get("password")
            })
        })

        const responseData = await response.json();

        if(Object.hasOwn(responseData, "errors"))
        {
            const errors = responseData.errors;
            DisplayNotification(...errors);
            return
        }

        window.location.href="../pages/authentification.html";       
    })
})

