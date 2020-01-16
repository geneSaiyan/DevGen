//Installing npm packages
const gs = require('github-scraper');
const inquirer = require("inquirer");
var fonts = {
    Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique'
    },
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
    Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic'
    },
    Symbol: {
        normal: 'Symbol'
    },
    ZapfDingbats: {
        normal: 'ZapfDingbats'
    }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');


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

            var docDefinition = {
                content: [
                    data.username,
                ],
                defaultStyle: {
                    font: 'Helvetica'
                }
            };

            var pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs.createWriteStream('devGen.pdf'));
            pdfDoc.end();
        })
    });;
