import nodemailer from 'nodemailer'

export const sendEmail = async options => {
    try {
        const transporter = nodemailer.createTransport({
            service: "SendGrid",
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD,
            },

        })

        const mailOptions = {
            from: 'Sleep <thesleepprojectbrazil@gmail.com>',
            to: options.email,
            subject: options.subject,
            text: options.message
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }



}