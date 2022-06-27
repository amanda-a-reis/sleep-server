import nodemailer from 'nodemailer'

export const sendEmail = async options => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Outlook365",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },

        })

        const mailOptions = {
            from: 'Sleep <sleepproject2022@outlook.pt>',
            to: options.email,
            subject: options.subject,
            text: options.message
        }

        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log(error)
    }



}