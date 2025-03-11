const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: "fnico",
    password: "password"
}];

const isValid = (username)=>{ //returns boolean
    let usersWithUsername = users.filter((user) => {return user.username === username});
    return usersWithUsername.length === 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username
  let password = req.body.password
  if(username && password){
    if(authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: password,
        }, 'access', {expiresIn: 60 * 60});
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).json({message: "Logged in user."});
    }
    else{
        return res.status(208).json({message: "Invalid login."})
    }
  }
  return res.status(404).json({message: "Please provide credentials."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
