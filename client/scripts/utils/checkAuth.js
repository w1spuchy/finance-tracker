export async function GetAuthorizedUser() {
    const response = await fetch("http://localhost:5000/auth/me",{
        credentials: "include"
    });
    
    if(response.ok)
    {
        const user = await response.json();
        return user;
    }
    const responseData = await response.json();
    console.log(responseData.message);
    return false;
}

export function initAuth(user)
{
    const profileNameNode = document.querySelector(".profile-name-p");
    profileNameNode.innerHTML = user.email;
    const logoutButtons = document.querySelectorAll(".nav-item.out");
    logoutButtons.forEach((button)=>{
        button.addEventListener("click",()=>{
            logout();
        })
    })
}

export function initNotAuth() {
    const notAutorizedPanel = document.querySelector(".not-authorized-panel");
    notAutorizedPanel.classList.add("active");
    const authButton = document.querySelector(".go-to-auth-button");
    authButton.addEventListener("click",()=>{
        window.location.href = window.location.href.includes("index.html") ? "./pages/authentification.html"
                                                                           : "../pages/authentification.html";
    })
}

async function logout()
{
    const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include"
    })

    if(response.ok)
    {
        window.location.href = window.location.href.includes("index.html") ? "./pages/authentification.html"
                                                                           : "../pages/authentification.html";
    }
} 

export default GetAuthorizedUser;
