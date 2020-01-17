//Installing npm packages
const gs = require('github-scraper');
const inquirer = require("inquirer");
const fs = require('fs');
const electron = require('electron-html-to');

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

            //HTML to PDF conversion 
            var conversion = electron({
                converterPath: electron.converters.PDF
            });

            conversion({
                html: `
              <!DOCTYPE html>
<html>

<head>
    <title>DevGen PDF</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <style>
        body{
            background-color: ${response.favColor};
        }
        </style>
        
</head>

<body>
<div class="container">
<img src="${data.avatar}" alt="DeveloperPic" class="img-thumbnail">



</div>
    
       
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
            crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
            integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
            crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"></script>
</body>

</html>
              
              
              ` }, function (err, result) {
                if (err) {
                    return console.error(err);
                }

                result.stream.pipe(fs.createWriteStream(`${data.username}Resume.pdf`));
                conversion.kill(); 
            });

        })
    });;

