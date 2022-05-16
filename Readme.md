#Project description
RUNNO website is a social media app inspired by Facebook and Instagram where user can share their posts there and follow their fellows. 

There are several functionalities such as sign up, sign in, uploading posts, editing posts as well as comments.  

RUNNO Users generally be able to do below functionalities:
- First sign up to application
- Second sign in into their existing account
- Registered user can create, edit and delete posts
- Runno users can comment to post and delete their comments as well
- Runno user is able to edit their profile info by Edit info button

The app has been ended as expected. But, it is decided that there will be big changes in the future:
- Users can follow and unfollow from users, also they can see follow and unfollow statistics in the profile page;
- Users can like and unlike posts, and see related posts they liked;
- Users can see suggestion list of users who they are close people around them;

#Bugs and problems around IBLOG app
About bug and problems, it is hard to handle DOM elements when they are iterated by forEach method. Fetching data takes some time to deliver complete 
data 
into app.

#Technologies used in the project

Backend
- Express
- Mysql
- Nodemon
- multer 
- Bcrypt 

Front End
- HTML - for skeleton of website
- CSS - for styling HTML elements
- JavaScript
- Fetch - to get api data from backend 
- Bootstrap - ready to use css components and classes
- Bootstrap icons

#ERD diagram
[![erdiagram-runno.png](https://i.postimg.cc/fTnVLHxg/erdiagram-runno.png)](https://postimg.cc/hhsDZ1Z9)
- User table saves data of user registered into app. It asks full_name, username, email and password
- Comments table create comment for each post and has a relationship with Post(post_id) and User(user_id).
- Post table contains data of each posts getting content, image info and has a relationship with user. post_author 
  identifies owner of post

#How to start project locally

- To start project locally run following command: `npm run dev`

- For deployment purpose you want to do following:   `npm start`

- Or we can simply run following: `node app.js`

#Website look

[![runno-signup.png](https://i.postimg.cc/5Nw4RQVT/runno-signup.png)](https://postimg.cc/BXnf86tB)
- User can register with following form

[![runno-signin.png](https://i.postimg.cc/nVNr5tQj/runno-signin.png)](https://postimg.cc/yWX7gtjs)
- Once user registered it is redirected to login page where they can enter writing-allowed area of app

[![index-runno.png](https://i.postimg.cc/FRc8HcDQ/index-runno.png)](https://postimg.cc/8Jpty72y)
- User can see their name and info in the main page, and some functionalities is allowed after logged in like My activities and Create post

[![post-runno.png](https://i.postimg.cc/mZyppTnV/post-runno.png)](https://postimg.cc/JttQGCMB)
- User can post by following modal component

[![edit-runno.png](https://i.postimg.cc/xT7vt79t/edit-runno.png)](https://postimg.cc/TpV5PtLD)
- Users can edit their info in this modal