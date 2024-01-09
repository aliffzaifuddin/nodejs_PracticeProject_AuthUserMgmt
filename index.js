const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./router/friends.js')

let users = []

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

const app = express();

app.use(session({secret:"fingerpint"},resave=true,saveUninitialized=true));

app.use(express.json());

/* This below code ensures that all the endpoints starting with /friends go through the middleware. It retrieves the authorization details from the session and verifies it. If the token is validated, the user is aunteticated and the control is passed on to the next endpoint handler. If the token is invalid, the user is not authenticated and an error message is returned. */

app.use("/friends", function auth(req,res,next){
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
      if(!err){
        req.user = user;
        next();
      }
      else{
        return res.status(403).json({message: "User not authenticated"})
      }
    });
  } else {
    return res.status(403).json({message: "User not logged in"})
  }
});

// Create an endpoint that will do the following
// Return an error if the username or password is not provided.
// Creates an access token that is valid for 1 hour (60 X 60 seconds) and logs the user in, if the credentials are correct.
// Throws an error, if the credentials are incorrect.

app.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

app.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


const PORT =5000;

app.use("/friends", routes);

app.listen(PORT,()=>console.log("Server is running"));

// You have an express server that has been configured to run at port 5000. When you access the server with /friends, you can access the end points defined in routes/friends.js. But for doing this, you need to register as a new user in the /register endpoint and login with those credentials in the /login endpoint.
