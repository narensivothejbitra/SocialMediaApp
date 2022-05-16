// target any element function
export const targetEl = (targetParent, targetAttribute) => {
    if (targetParent) return targetParent.querySelector(targetAttribute)
    return null
}

export const getAllElements = (parent, targetAttribute) => {
    if (parent) return parent.querySelectorAll(targetAttribute)
    return null
}

export const setUserIntoStorage = (user) => {
    if (user) return localStorage.setItem('user', JSON.stringify(user))
}

export const getUserFromStorage = () => {
    return JSON.parse(localStorage.getItem('user'))
}

export const removeUserFromStorage = () => {
    return localStorage.removeItem('user')
}

export const loadingContainer = (element, type) => {
    if(element) {
        element.setAttribute('disabled', "")
        return element.innerHTML += `
            <div class="spinner-grow spinner-grow-sm text-${type}" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
        `

    }
    return null
}

export const removeLoadingContainer = (element) => {
    if(element) {
        element.removeAttribute("disabled")
        return element.removeChild(element.lastElementChild)

    }
    return null
}

export const setAlert = (element, message, type) => {
    if(element) {
        element.innerHTML = `
                <div class="alert fs-6 alert-${type}" role="alert">
                  ${message}
                </div>
        `
        setTimeout(()=> {
            element.innerHTML = ""
        }, 2500)
    }
    return null
}

export const fetchData = async (route = "", data = {}, method, headers = {}) => {
        const response = await fetch(`${route}`, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers
            },
            mode: 'cors',
            credentials: 'same-origin'
        })

        if (response.ok) return await response.json()
        throw await response.json()
}