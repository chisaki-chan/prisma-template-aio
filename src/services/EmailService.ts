import nodemailer from 'nodemailer';

interface EmailData {
    subject?: string;
    to?: string;
    cc?: string;
    text?: string;
    body?: string;
    attachments?: any[];
}

export async function emailSender(data: EmailData): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const transport = nodemailer.createTransport({
            host: 'mail.aio.co.id',
            port: 587,
            secure: false,
            auth: {
                user: 'appsskb@aio.co.id',
                pass: 'Plicaskb1234',
            },
            tls: { rejectUnauthorized: false },
            debug: true,
        });

        const message = {
            subject: data.subject,
            from: '"Optima Apps" <appsskb@aio.co.id>',
            to: data.to,
            cc: data.cc || '',
            text: data.text,
            html: data.body,
            attachments: data.attachments || [],
        };

        transport.sendMail(message, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}