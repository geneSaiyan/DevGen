//Installing npm packages
const gs = require('github-scraper');
const inquirer = require("inquirer");
var fs = require('fs');
convertFactory = require('electron-html-to');

inquirer
    //Prompt user to enter a github username
    .prompt([
        {
            type: "input",
            message: "Enter a github username",
            name: "username"
        },
        {
            type: "input",
            message: "What is your favorite color?",
            name: "favColor"
        }

    ])
    .then(function (response) {
        //Place the username in a variable for the url search
        var url = `/${response.username}`

        //Use github-scraper to return the github data based on the username input
        gs(url, function (err, data) {

    
            console.log(data);

            var conversion = convertFactory({
                converterPath: convertFactory.converters.PDF
              });
               
              conversion({ html: `'<h1>${data.username}</h1>'` }, function(err, result) {
                if (err) {
                  return console.error(err);
                }
               
                console.log(result.numberOfPages);
                console.log(result.logs);
                result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
                //conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
              });

        })
    });;
