const fs = require('fs');
//Installing npm packages
const axios = require('axios');
const inquirer = require("inquirer");
const electron = require('electron-html-to');
const gs = require('github-scraper');

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

        //Github username search URL
        let githubUrl = `https://api.github.com/users/${response.username}`;

        //Url used to search for a count of the number of stars
        let starCountUrl = `/${response.username}`

        //Using github scraper package to get the star count
        gs(starCountUrl, function (err, gsData) {

            //Using Axios to retrieve the user data from github api
            axios.get(githubUrl)
                .then(function (user) {

                    //Console.log the returned developer data
                    console.log(user);

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
                            border-radius: 5px;
                        }
                        #content{
                            margin: 2%;
                            padding-top: 2%;
                        }
                   

                    </style>
                </head>
                
                <body>
                
                    <div class="container">
                        <h1 style="margin-top:2%">DevGen: Profile Generator</h1>
                        <hr>
                        <div id="mainDiv">
                        <div class="row" id="content">
                            <div class="col-4">
                                <div class="card" style="width: 18rem;">
                                    <img src="${user.data.avatar_url}" class="card-img-top"
                                        alt="avatar">
                                    <div class="card-body">
                                        <h5 class="card-title" >${response.username}</h5>
                                        <p><a href="https://www.google.com/maps/search/?api=1&query=${user.data.location}" target="_blank">${user.data.location}</a></p>
                                        <a href="${user.data.url}" target="_blank" style="width:120px" class="btn btn-dark">My Github</a> 
                                        <a href="${user.data.blog}" target="_blank" style="width:120px" class="btn btn-dark">My Blog</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-8">
                                    <div class="jumbotron">
                                            <h1 class="display-4">${user.data.name}</h1>
                                            <p class="lead">${user.data.bio}</p>
                                            <hr class="my-4">
                                            <p>Public Repositories: ${user.data.public_repos}</p>
                                            <p>GitHub Stars: ${gsData.stars}</p>
                                            <p>Followers: ${user.data.followers}</p>
                                            <p>Following: ${user.data.following}</p>
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
                
                </html> ` 
            
            }, function (err, result) {

                        if (err) {
                            return console.error(err);
                        }

                        //Create the PDF that is unique with the developers github username
                        result.stream.pipe(fs.createWriteStream(`./pdf_resumes/${user.data.login}Resume.pdf`));
                        conversion.kill();
                        console.log(`Succesfully created a PDF resume for ${user.data.login} in the pdf_resumes folder.`);
                    });

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
        })
        //End here

    });;

