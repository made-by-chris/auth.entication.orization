import VerificationCode from '../models/VerificationCode.js';
import nodemailer from 'nodemailer';

export default async function sendVerificationEmail(user) {
    const {email, _id} = user;
    const newVerificationCode = Math.floor(Math.random() * 899999) + 100000
    
    await VerificationCode.create({
        user_id: _id,
        code: newVerificationCode,
        valid: true
    })

    var transporter = nodemailer.createTransport({
        host: 'krieger.asoshared.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.dev_email,
          pass: process.env.dev_password
        }
    });
    
    try {
        var mailOptions = {
            from: 'dont@forgetmy.email',
            to: email,
            subject: 'Please Confirm Your [INSERT COMPANY NAME] Account',
            text: `Hi there! One more step. Please click on this verification email: http://localhost:5000/users/verify?verification_code=${newVerificationCode}`
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500)
                res.send({ error: error })
            } else {
                console.log('Email sent: ' + info.response);
                res.send('email sent');
            }
        });
    } catch(e) {
        console.log(e);
        res.status(500).json({ message: "there was an error generating email verification stuff", data: e })
    }
}