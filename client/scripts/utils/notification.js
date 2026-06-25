export async function DisplayNotification(...errors)
{
    const notificationContainer = document.querySelector(".notification-container");
    for(const err of errors){
        if(notificationContainer.childElementCount >= 5)
        {
            await waitForFreeSlot(notificationContainer, 5);
        }
        const notificationBlock = document.createElement("div");
        notificationBlock.classList.add("notification-block");
        notificationBlock.innerHTML = 
        `
        <p class="notification-text">${err}</p>
        `
        notificationContainer.appendChild(notificationBlock);
        setTimeout(() => {
            notificationBlock.classList.add("error");
            notificationBlock.classList.add("active");
        }, 0);
        setTimeout(() => {
            notificationBlock.classList.remove("active");
                setTimeout(()=>{
                notificationBlock.remove()
            }, 500);
        }, 3000);
    }
}

function waitForFreeSlot(container, max = 5) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (container.childElementCount < max) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

export default DisplayNotification;