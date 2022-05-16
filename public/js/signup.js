import {fetchData, loadingContainer, removeLoadingContainer, setAlert, targetEl} from "./utils.js";

const form = targetEl(document, '#signup_form')

form.addEventListener("submit", async (event) => {
    event.preventDefault()
    const data = {
        full_name: form["full_name"].value,
        username: form["username"].value,
        email: form["email"].value,
        password: form["password"].value
    }
    const button = form["submit_btn"]
    const errorContainer = targetEl(document, "#signup_error")
    loadingContainer(button, "light")
    await fetchData('/user/signup', data, 'POST').then((res) => {
        removeLoadingContainer(button)
        if(res.ok) setAlert(errorContainer, res.message, "success")
        window.location.href = "/signin"
    }).catch((err) => {
        removeLoadingContainer(button)
        if(!err.ok) setAlert(errorContainer, err.error, "danger")
    })
})