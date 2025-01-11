import { config } from 'dotenv';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

config();

export class MailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to: string, link: string) {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: to,
        subject: 'Активація акаунту - StudentsHunt',
        text: '',
        html: `
       <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
            <h1 style="font-size: 24px;">Для активації натисніть на кнопку "Підтвердити" (нижче)</h1>
            <a href="${link}" style="
            display: inline-block;
            width: 200px;
            padding: 15px;
            margin: 20px auto;
            background-color: #007BFF; /* голубой цвет */
            color: white;
            text-decoration: none;
            text-align: center;
            border-radius: 5px;
            font-size: 18px;
            transition: background-color 0.3s;
            ">
                Підтвердити
            </a>
            <p style="font-size: 16px;">Якщо кнопка не працює, скопіюйте і вставте це посилання в адресну строку вашого браузера: <a href="${link}" style="color: #007BFF;">${link}</a></p>
        </div>

        `,
      });
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      return Error(error);
    }
  }
}
