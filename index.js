const fs = require('fs');
//Installing npm packages
const axios = require('axios');
const inquirer = require("inquirer");
const electron = require('electron-html-to');
var gs = require('github-scraper');

inquirer
    //Prompt user to enter a github username and favorite color
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
        var githubUrl = `https://api.github.com/users/${response.username}`;

        //Using Axios to retrieve the data from github api
        axios.get(githubUrl)
            .then(function (data) {

                //Console.log the returned data
                console.log(data);

                //HTML to PDF conversion  using electron-html-to
                var conversion = electron({
                    converterPath: electron.converters.PDF
                });

                //Html template for the PDF
                conversion({
                    html: `
                <!DOCTYPE html>
                <html>
                
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>DevGen PDF</title>
                   
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                        
                    <style>
                        body {
                            -webkit-print-color-adjust: exact !important;
                        }
                        #mainDiv {
                            background-color: ${response.favColor};
                        }
                    </style>
                </head>
                
                <body>
                
                    <div class="container">
                        <h1 style="margin-top:2%">DevGen: Profile Generator</h1>
                        <hr>
                        <div id="mainDiv">
                        <div class="row">
                            <div class="col-4">
                                <div class="card" style="width: 18rem;">
                                    <img src="${data.data.avatar_url}" class="card-img-top"
                                        alt="avatar">
                                    <div class="card-body">
                                        <h5 class="card-title" >${response.username}</h5>
                                        <p><a href="https://www.google.com/maps/search/?api=1&query=${data.data.location}" target="_blank">${data.data.location}</a></p>
                                        <a href="${data.data.url}" target="_blank" style="width:120px" class="btn btn-primary">My Github</a> 
                                        <a href="${data.data.blog}" target="_blank" style="width:120px" class="btn btn-primary">My Blog</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8">
                                    <div class="jumbotron ">
                                            <h1 class="display-4">${data.data.name}</h1>
                                            <p class="lead">${data.data.bio}</p>
                                            <hr class="my-4">
                                            <p>Public Repositories: ${data.data.public_repos}</p>
                                            <p>GitHub Stars: </p>
                                            <p>Followers: ${data.data.followers}</p>
                                            <p>Following: ${data.data.following}</p>
                                          </div>
                            </div>
                        </div>
                    </div>
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

                    //Create the PDF that is unique with the developers github username
                    result.stream.pipe(fs.createWriteStream(`${data.data.login}Resume.pdf`));
                    conversion.kill();
                });

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })


    });;

