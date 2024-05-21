const nodemailer = require('nodemailer');
require('dotenv').config();
const puppeteer = require('puppeteer');
require("dotenv").config();

const invoiceEmail = async ({ endpoint, mail }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_AUTH_USER,
                pass: process.env.GMAIL_AUTH_PASSWORD,
            },
        });
        console.log("reach1")

        const browser = await puppeteer.launch({
            headless: 'shell',
            devtools: false,
        });
        console.log("reach2")

        const page = await browser.newPage();
        await page.emulateMediaType('print')
        console.log("reach3")


        const optionsPDF = {
            path: 'print.pdf',
            printBackground: true,
            format: "A4",
            width: '4.8cm',
            scale: 1,
            preferCSSPageSize: true,
            margin: {
                top: "10px",
                right: "0px",
                bottom: "10px",
                left: "20px"
            },
            quality: 100,
        }

        await page.goto(`${process.env.FRONTEND_URL}${endpoint}`, { "waitUntil": "networkidle0" });
        await page.waitForSelector('.print-only-section');
        const pdfBuffer = await page.pdf(optionsPDF);
        await browser.close();

        const mailOptions = {
            from: process.env.GMAIL_AUTH_USER,
            to: mail,
            subject: 'Invoice',
            text: 'Please find attached invoice',
            attachments: [
                {
                    filename: 'generated_invoice.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                // res.status(500).json('Error sending invoice');
            } else {
                console.log('Email sent: ' + info.response);
                // res.status(200).json('Invoice sent successfully');
            }
        });

    } catch (error) {
        console.log(error)
        return error
    }
};

module.exports = invoiceEmail