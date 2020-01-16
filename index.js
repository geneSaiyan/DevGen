//Installing npm packages
var gs = require('github-scraper');
var inquirer = require("inquirer");

inquirer
//Prompt user to enter a github username
    .prompt([
        {
            type: "input",
            message: "Enter a github username",
            name: "username"
        }
    ])
    .then(function (response) {
        //Place the username in a variable for the url search
        var url = `/${response.username}`

        //Use github-scraper to return the github data based on the username input
        gs(url, function (err, data) {
            console.log(data);
        })
    });;
