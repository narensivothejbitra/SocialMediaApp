import {
    fetchData,
    getAllElements,
    getUserFromStorage,
    loadingContainer,
    removeLoadingContainer,
    removeUserFromStorage,
    setAlert,
    setUserIntoStorage,
    targetEl
} from "./utils.js";

const user = getUserFromStorage()
const userInfoContainer = targetEl(document, "#user_info")
const suggestionList = targetEl(document, "#suggestion_list")
const creat_post_form = targetEl(document, "#post_form")
const postList = targetEl(document, "#posts_list")

//check user
if (!user) {
    window.location.href = "/signin"
}

// inserting usr info into main page
const img = user.avatar ? user.avatar : "/images/person.svg"
userInfoContainer.innerHTML = `
              <img src="${img}" alt="twbs" class="comment-user-img rounded-circle flex-shrink-0">
              <div class="d-flex gap-2 w-100 justify-content-between">
                            <div>
                                <h6 class="mb-0 fw-bold">${user.username}</h6>
                                <p class="mb-0 opacity-75">${user.full_name}</p>
                            </div>
                            <button class="btn btn-sm px-4 btn-outline-primary opacity-50 text-nowrap" data-bs-toggle="modal" data-bs-target="#edit_user_modal">Edit</button>
              </div>
`

await fetch("/user/getUser", {
    method: 'GET', headers: {
        'Content-Type': "application/json", Accept: "application/json", Authorization: `ID ${user.user_id}`
    }
}).then((res) => res.json()).then((users) => {
    users.forEach((user) => suggestionList.innerHTML += `
            <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                        <img src="${user.avatar ? user.avatar : "/images/person.svg"}" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
                        <div class="d-flex gap-2 w-100 justify-content-between">
                            <div>
                                <h6 class="mb-0 fw-bold">${user.username}</h6>
                                <p class="mb-0 opacity-50">
                                    New to Runno
                                </p>
                            </div>
                            <button accesskey="${user.user_id}" id="follow_btn" class="btn btn-sm px-4 btn-outline-primary opacity-50 text-nowrap">Follow +</button>
                        </div>
            </a>
    `)
}).catch((err) => {
    console.log(err)
})

const logout_btn = targetEl(document, "#logout_btn")
logout_btn.addEventListener("click", (e) => {
    removeUserFromStorage()
    window.location.href = "/"
})

const avatarImg = targetEl(document, "#avatar_img")
user.avatar && avatarImg.setAttribute('src', user.avatar)

// create post form
creat_post_form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("images", creat_post_form["images"].files[0])
    formData.append("content", creat_post_form["content"].value)

    const button = targetEl(document, "#post_submit_btn")
    const alert = targetEl(document, ".alert-container")
    loadingContainer(button, "light")
    await fetch("/post/createPost", {
        method: "POST", body: formData, headers: {
            Authorization: `ID ${user.user_id}`
        }
    }).then((res) => res.json()).then((data) => {
        removeLoadingContainer(button)
        setAlert(alert, data.message, "success")
        window.location.href = "/"
    }).catch((err) => {
        console.log(err)
        removeLoadingContainer(button)
        setAlert(alert, err.error, "danger")
    })
})

await fetch("/post/all", {
    method: 'GET', headers: {
        "Content-Type": "application/json"
    }
}).then((res) => res.json()).then((data) => {
    data.forEach((post) => {
        const post_date = new Date(post.created_at)
        postList.innerHTML += `
                     <div class="col">
                        <div class="card shadow-sm runno-card">
                            <div class="runno-card-img">
                                <img src="${post.images}" class="runno-img" alt="${post.content}">
                            </div>

                            <div class="card-body">
                                <p class="card-text">
                                    ${post.content}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button accesskey="${post.post_id}" id="like_post" type="button" class="btn btn-outline-secondary">
                                            <i class="bi bi-heart text-secondary"></i>
                                        </button>
                                        <button id="open_comment" type="button" class="btn btn-outline-secondary ms-1">
                                            <img src="/images/chat.svg" alt="Comments of post">
                                        </button>
                                    </div>
                                    <small class="text-muted">${post_date.toString().slice(0, 25)}</small>
                                </div>
                                <div id="post_comments" class="card-comments" style="display: none">
                                    <form id="comment_form" class="mb-3 mb-lg-0 me-lg-3 d-flex align-items-center justify-content-center gap-2" role="comment">
                                        <input type="text" class="form-control" placeholder="Express your feeling about post..." aria-label="comment" name="content" id="content" required>
                                        <input type="hidden" value="${post.post_id}" name="post_id" id="post_id" >
                                        <button type="submit" class="btn btn-primary fs-6">
                                            Post
                                        </button>
                                    </form>

                                    <div id="comment_list" class="list-group comment-list-group mt-3 w-auto">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

        `
    })
}).catch((err) => {
    console.log(err)
})
const comment_open_btn = getAllElements(document, "#open_comment"), postCommentsContainer = getAllElements(document, "#post_comments"),
    like_post_btn = getAllElements(document, "#like_post")

comment_open_btn.forEach((button) => {
    button.addEventListener("click", (e) => {
        postCommentsContainer.forEach((post_comment) => {

            post_comment.classList.toggle('d-block')
            window.scrollTo(0, post_comment.offsetHeight + 500)
        })
    })
})

like_post_btn.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.stopPropagation()

        button.classList.toggle("btn-danger")
        button.lastElementChild.classList.toggle("text-secondary")

    })
})


const comment_form = getAllElements(document, "#comment_form")
comment_form.forEach((form) => {
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const data = {
            content: form['content'].value, post_id: form["post_id"].value
        }

        await fetchData("/comment/create", data, "POST", {
            Authorization: `ID ${user.user_id}`
        }).then((res) => window.location.href = "/").catch((err) => console.log(err))

    })
})


//fetch comments
const commented_postid = targetEl(document, "#post_id").value
await fetch(`/comment/all/${commented_postid}`, {
    method: "GET", headers: {
        "Content-Type": "application/json"
    }
}).then((res) => res.json()).then((comments) => {
    const commentList = targetEl(document, "#comment_list")
    comments.data.forEach((comment) => {
        const commented_time = new Date(comment.timestamps)

        commentList.innerHTML += `
            <a class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                 <img src="images/person.svg" alt="twbs"
                      class="rounded-circle flex-shrink-0 comment-user-img">
                 <div class="d-flex gap-2 w-100 align-items-center justify-content-between">
                 <p class="mb-0 opacity-75">
                    ${comment.content}
                 </p>
                 <small class="opacity-50 text-nowrap">
                    ${commented_time.toString().slice(0, 25)}
                 <i accesskey="${comment.comment_id}" id="comment_delete_btn" class="bi bi-trash text-danger" style="cursor: pointer"></i>

                 </small>
                 </div>
            </a>
        `
    })
}).catch((err) => console.log(err))

const comment_delete_btn = targetEl(document, "#comment_delete_btn")
comment_delete_btn.addEventListener("click", async (e) => {
    await fetch(`/comment/delete/${comment_delete_btn.accessKey}`, {
        method: "DELETE",
    }).then((res) => res.json()).then((data) => {
        window.location.href = "/"
    }).then((err) => console.log(err))
})


const search_users = targetEl(document, "#search_users"), searchResult = targetEl(document, "#search_results")

search_users.addEventListener("change", async (e) => {

    await fetch(`/user/searchUser?searchTerm=${e.target.value}`, {
        method: "GET", headers: {
            Authorization: `ID ${user.user_id}`
        }
    }).then((res) => res.json())
        .then((data) => {
            data.slice(0, 5).forEach((user) => {
                const user_img = user.avatar ? user.avatar : "/images/person.svg"
                if (!e.target.value) return searchResult.innerHTML = ""
                searchResult.innerHTML += `
                <a href="#" class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                        <img src="${user_img}" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0">
                        <div class="d-flex gap-2 w-100 justify-content-between">
                            <div>
                                <h6 class="mb-0 fw-bold">${user.username}</h6>
                                <p class="mb-0 opacity-50">
                                    New to Runno
                                </p>
                            </div>
                            <button accesskey="${user.user_id}" id="follow_btn" class="btn btn-sm px-4 btn-outline-primary opacity-50 text-nowrap">Follow +</button>
                        </div>
                </a>
            `
            })


        })
        .catch((err) => console.log(err))
})

// follow
const follow_btn = getAllElements(document, "#follow_btn"), suggeston_alert_container = targetEl(document, "#suggestion-alert-container")
console.log(suggeston_alert_container)
follow_btn.forEach((button) => {
    const following_id = button.accessKey
    button.addEventListener("click", async (e) => {
        fetch(`/user/follow/${following_id}`, {
            method: "PUT", headers: {
                Authorization: `ID ${user.user_id}`
            }
        }).then((res) => res.json())
            .then((result) => {
                result.error && setAlert(suggeston_alert_container, result.error.message, "success")
                button.setAttribute("disabled", "")
                button.textContent = "Unfollow"
            })
            .catch((err) => setAlert(suggeston_alert_container, err.error, "danger"))
    })

})

const edit_user_form = targetEl(document, "#edit_user_form"),
    editAlertContainer = targetEl(document, ".edit-user-alert-container")
edit_user_form["full_name"].value = user.full_name
edit_user_form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("avatar", edit_user_form["avatar"].files[0])
    formData.append("full_name", edit_user_form["full_name"].value)

    await fetch(`/user/editUser`, {
        method: 'PUT', body: formData, headers: {
            Authorization: `ID ${user.user_id}`
        }
    }).then((res) => res.json()).then((res) => {
            setUserIntoStorage(res)
            setAlert(editAlertContainer, "Edited successfully", "success")
            window.location.href = "/"
        }
    ).catch((err) => console.log(err))

})

const delete_user_btn = targetEl(document, "#delete_user")
delete_user_btn.addEventListener("click", async (e) => {
    e.stopPropagation()

    await fetch(`/user/delete/${user.user_id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `ID ${user.user_id}`
        }
    }).then((res) => res.json()).then((data) => {
        removeUserFromStorage()
        window.location.href = "/"
    }).catch((err) => {
        console.log(err)
    })
})

const searchForm = targetEl(document, "#search_form")
searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
})