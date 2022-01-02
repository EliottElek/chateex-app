# Chateex <img src = "https://user-images.githubusercontent.com/64375473/146653401-883f5ce7-448c-4171-b3a1-93c7d15c987f.png" alt ="icon" width = "30px" height = "auto"/>

Chat application made with NodeJS and ReactJS, in a team composed of Paul Gedda and Eliott Morcillo.

## Usage

Start by cloning the project :
`git clone https://github.com/EliottElek/ChatAppEce.git`

###  front-end

navigate through ChatAppEce/front-end  and install packages: 

`cd ChatAppEce/front-end`
`npm install`

launch front-end : 

`yarn start` or `npm start`

### back-end

navigate through ChatAppEce/back-end  and install packages: 

`cd ChatAppEce/back-end`
`npm install`

lanch tests : 

`yarn test` or `npm test`

initialise the db : 

`cd bin/node init` or `npm run init`
(this command will create 55 random users)

Finally, start the back-end : 
`cd bin/node start` or `npm run start`

### dex server

navigate through ChatAppEce/dex :
`cd dex`
`bin/dex serve config.yaml`

You're all set to start the chat application.

# Features 

A lot of features have been implemented on this chat application. Actually, all of the basic requested features have been implemented, such as : 
- A landing page (http://localhost:3000/landing) the first thing you'll land on.
- Create channel
- Add members 
- You only have access to channels you created or that you've been added to
- Invite users to channel
- Modify messages
- Modify channel
- Delete channel
- Delete messagee
- Account setting
- Gravatar implementation
- Avatar selection

# Additional features 🥳

Let's now see the most interesting part : what's the plus-value of our application ? 

### Direct notifications and messages with Socket.io

You will receive your messages and notifications instantly : the application is set up with sockets. 

<img src = "https://user-images.githubusercontent.com/64375473/146656762-478172b4-65cc-410d-91fb-05ab56a1ddcd.gif" alt ="icon" height = "auto" width = "90%"/>

### Custom color theme/ background theme

You can choose ANY color you want for your app, or even choose a custom theme from our selection.

<img src = "https://user-images.githubusercontent.com/64375473/146656879-228af201-9d0a-49af-838b-a8d02e62fa48.gif" alt ="icon" height = "auto" width = "90%"/>

### Message reaction

You can add reaction to any messages you want, and with any emoji you want. When you add a reaction to a message in a chat group, others can also add a reaction to that same message. When you decide to add a reaction to that message again, it will overwrite the previous one. You can also remove your reaction at any moment.

<img src = "https://user-images.githubusercontent.com/64375473/146655884-28982f2e-9a23-4861-b19a-559dd3ec71d8.png" alt ="icon" height = "300px" width = "auto"/>
<img src = "https://user-images.githubusercontent.com/64375473/146655832-bb15e86e-9a97-4158-82f8-a5c90eba2b07.png" alt ="icon"height = "300px" width = "auto"/>

### Gifs and Emojis 🤩👍✅

You can add Gifs and emojis to your chats ! Simply hit the emoji or gif buttons to open the selection modals.

<img src = "https://user-images.githubusercontent.com/64375473/146655950-1e478a93-bf98-4a48-9f30-284ed1d93332.png" alt ="icon" height = "300px" width = "auto"/>
<img src = "https://user-images.githubusercontent.com/64375473/146655967-e64121bc-67c4-4bf7-8ab0-b4a722ae0d09.png" alt ="icon" height = "300px" width = "auto"/>

### Drag & Drop images 🌩

You can upload images, either as a message or to change you avatar or a channel's picture. 

<img src = "https://user-images.githubusercontent.com/64375473/146656019-bfde4e76-5c26-42dd-ac04-39bd0eb38da9.png" alt ="icon" height = "300px" width = "auto"/>
<img src = "https://user-images.githubusercontent.com/64375473/146656030-eee090c4-d23c-4767-8121-7baa448cf386.png" alt ="icon" height = "300px" width = "auto"/>

### Avatar selection & Gravatar

By default, when creating an account, the app will set your avatar as your gravatar. You can change it whenever your want, with a picture you uploaded or you can choose between our vast selection of avatars.

<img src = "https://user-images.githubusercontent.com/64375473/146656117-a01262ca-ca1f-40fa-af57-79ca6dba9442.png" alt ="icon" height = "300px" width = "auto"/>


### Administrator rights and private conversations

When you create a chat group, you become the administator of the group. You can add and remove people, change the name and picture of the channel and delete it. When you're invited to a group, you can only view people and leave the channel. When you create a private conversation (only two people), it will first check if you already have a conversation witht this person, and will redirect you to this conversation if it exists, or create one if it doesn't.

(Administrator on the left, guest on the right)

<img src = "https://user-images.githubusercontent.com/64375473/146657832-b0c0a6b7-3bd0-4f1a-b012-7a987ffd8269.png" alt ="icon" height = "auto" width = "90%"/>

### Account registration 

You have the choice to either create an account directly through our registration form (http://localhost:3000/register) or register/login with another application (github).
When you log in with another application, the app will check for the account linked to your email address. If no account is found, it will create the account with your github username, email and gravatar.

### Account deletion

You can delete your acount at any time you want. 


