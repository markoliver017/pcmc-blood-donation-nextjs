import { send_mail } from "@lib/mail.utils";


export async function POST(req) {
    const body = await req.json();
    console.log("send-mail body: >>>>>>>>>>>>>>>>>>", body);

    const { to, subject, text, html, attachFiles = [] } = body;

    const res = await send_mail(to, subject, text, html, attachFiles);

    return Response.json(res);

}


// import { logErrorToFile, logSuccessToFile } from '@lib/logger.server';
// import nodemailer from 'nodemailer';

// export async function POST(req) {
//     const body = await req.json();
//     console.log("send-mail body: >>>>>>>>>>>>>>>>>>", body)
//     try {
//         const { to, subject, text, html } = body;

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             secure: false,
//             auth: {
//                 user: 'mark.roman@pcmc.gov.ph',
//                 pass: 'kzlfpygmqoziynim',
//             },
//         });

//         const info = await transporter.sendMail({
//             from: '"pcmc-notification" <mark.roman@pcmc.gov.ph>',
//             to, // from request
//             subject,
//             text,
//             html,
//         });

//         logSuccessToFile(`Email sent to ${to} with subject "${subject}". Message ID: ${info.messageId}`, 'send-email');

//         return Response.json({ success: true, messageId: info.messageId });
//     } catch (error) {
//         logErrorToFile(error, 'send-email');
//         return Response.json({ success: false, error: error.message }, { status: 500 });
//     }
// }


