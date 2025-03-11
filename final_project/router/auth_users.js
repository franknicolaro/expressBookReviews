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
    let review = req.query.review
    let isbn = parseInt(req.params.isbn)
    if(!review || !isbn){
        return res.status(404).json({message: "Please provide your review, username, and an isbn."})
    }
    let username = req.session.authorization['username']

    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Book review updated"});
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
    let isbn = parseInt(req.params.isbn);
    if(!isbn){
        return res.status(404).json({message: "ISBN not provided."})
    }
    let username = req.session.authorization['username']
    delete books[isbn].reviews[username]
    return res.status(200).json({message: "Review deleted."})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
