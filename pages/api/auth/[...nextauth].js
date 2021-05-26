// == Import : npm
import NextAuth from 'next-auth';
import nodemailer from "nodemailer"
import Providers from 'next-auth/providers';

// == Import : local
import dbConnect from '../../../utils/dbConnect';
import User from "../../../models/User";
import { html, text } from "../../../utils/customEmailVerification";


export default NextAuth({
    providers: [
        Providers.Email({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
            sendVerificationRequest: ({
                identifier: email,
                url,
                token,
                baseUrl,
                provider,
            }) => {
                return new Promise((resolve, reject) => {
                    const { server, from } = provider
                    // Strip protocol from URL and use domain as site name
                    const site = baseUrl.replace(/^https?:\/\//, "")

                    nodemailer.createTransport(server).sendMail(
                        {
                            to: email,
                            from,
                            subject: `Connexion à ${site}`,
                            text: text({ url, site, email }),
                            html: html({ url, site, email }),
                        },
                        (error) => {
                            if (error) {
                                //logger.error("SEND_VERIFICATION_EMAIL_ERROR", email, error)
                                return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR", error))
                            }
                            return resolve()
                        }
                    )
                })
            },
        })
    ],
    pages: {
        signIn: '/auth'
    },
    callbacks: {
        session: async (session, user) => {
            await dbConnect();
            session.user = await User.findById(user.id);
            return session;
        }
    },
    database: process.env.MONGO_URI
});
