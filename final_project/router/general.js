const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username
    let password = req.body.password
    if(username && password){
        if(isValid(username)){
            users.push({username: username, password: password});
            return res.status(200).json({message: "User registered. You may now login."});
        }
        else{
            return res.status(404).json({message: "User already exists."})
        }
    }
  //Write your code here
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let booksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000)
    });
    booksPromise.then((data) =>{ 
        console.log("Books obtained.");
        res.send(data);
    })
    .catch((error) =>{
        return res.status(500).json({message: error})
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn)
    if(!isbn){
        return res.status(303).json({message: "ISBN not provided"});
    }
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books[isbn]);
        }, 1000)
    });
    bookPromise.then((data) =>{ 
        console.log("Book obtained.");
        res.send(data);
    })
    .catch((error) =>{
        return res.status(500).json({message: error})
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    if(!author){
        return res.status(303).json({message: "Author not provided"})
    }
    let filteredBooks = []
    for(let i = 1; i <= 10; i++){
        if(books[i].author === author){
            filteredBooks.push(books[i])
        }
    }
    if(!filteredBooks){
        return res.status(303).json({message: "Author does not exist."})
    }
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(filteredBooks);
        }, 1000)
    });
    bookPromise.then((data) =>{ 
        console.log("Book(s) obtained.");
        res.send(data);
    })
    .catch((error) =>{
        return res.status(500).json({message: error})
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    if(!title){
        return res.status(303).json({message: "Title not provided"})
    }
    let filteredBooks = []
    for(let i = 1; i <= 10; i++){
        if(books[i].title === title){
            filteredBooks.push(books[i])
        }
    }
    if(!filteredBooks){
        return res.status(303).json({message: "Book with title does not exist."})
    }
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(filteredBooks);
        }, 1000)
    });
    bookPromise.then((data) =>{ 
        console.log("Book(s) obtained.");
        res.send(data);
    })
    .catch((error) =>{
        return res.status(500).json({message: error})
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  if(!isbn){
    return res.status(303).json({message: "ISBN not provided"});
  }
  return res.send(books[isbn].reviews)
});

module.exports.general = public_users;
