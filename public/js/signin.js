import {fetchData, loadingContainer, removeLoadingContainer, setAlert, setUserIntoStorage, targetEl} from "./utils.js";


const form = targetEl(document, "#signin_form")
const alertContainer = targetEl(document, "#signin_error")
const submit_btn = targetEl(document, "#submit_btn")
form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = {
        email: form["email"].value,
        password: form["password"].value
    }

    loadingContainer(submit_btn, "light")
    await fetchData("/user/signIn", data, "POST").then((res) => {
        setUserIntoStorage(res[0])
        removeLoadingContainer(submit_btn)
        window.location.href = "/"
    }).catch((err)=> {
        setAlert(alertContainer, err.error, "danger")
        removeLoadingContainer(submit_btn)
    })
})