document.addEventListener('DOMContentLoaded', ()=>{
    const regForm = document.getElementById("registration-form");
    regForm.addEventListener('submit', (event)=>
    {
        event.preventDefault();
        console.log(Array.from(SerializeForm(regForm).entries()));
    })
})


function SerializeForm(formNode)
{
    const { elements } = formNode;

    const data = new FormData();

    Array.from(elements).filter((item)=>{ return !!item.name })
    .forEach((el)=>
    {
        const { name, type } = el;
        const value = type === 'checkbox' ? el.checked : el.value;
        data.append(name, value)
    });
    return data
}