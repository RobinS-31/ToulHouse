export const html = ({ url, site, email }) => {
    // Insert invisible space into domains and email address to prevent both the
    // email address and the domain from being turned into a hyperlink by email
    // clients like Outlook and Apple mail, as this is confusing because it seems
    // like they are supposed to click on their email address to sign in.
    const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
    const escapedSite = `${site.replace(/\./g, "&#8203;.")}`

    // Some simple styling options
    const backgroundColor = "#f9f9f9"
    const textColor = "#444444"
    const mainBackgroundColor = "#ffffff"
    const buttonBackgroundColor = "#346df1"
    const buttonBorderColor = "#346df1"
    const buttonTextColor = "#ffffff"

    // Uses tables for layout and inline CSS due to email client limitations
    return `
        <body style="background: ${backgroundColor};">
            <div style="padding: 10px 0 20px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-align: center;">
                <strong>${escapedSite}</strong>
            </div>
            <div style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px; width=100%; border=0; border-spacing: 20px;">
                <div>
                    <div style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-align: center;">
                        Si vous êtes sur <strong>smartphone</strong> ou <strong>tablette</strong> :
                    </div>
                    <div style="padding: 5px 0 10px 0; font-size: 15px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-align: center;">
                        Pour profiter de toutes les fonctionnalités du site, copiez le lien du bouton "<strong>Se Connecter</strong>" et collez le directement dans votre navigateur (Chrome, Firefox, Safari, etc).
                    </div>
                    <div style="padding: 0 0 20px 0; font-size: 10px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-align: center;">
                        Pour copier le lien restez appuyé sur le bouton "<strong>Se Connecter</strong>", une fenêtre s'ouvrira, cliquez sur <strong>"Copier l'URL"</strong> ou <strong>"Copier le lien"</strong>.
                    </div>
                </div>
                <div style="border-radius: 5px; background-color: ${buttonBackgroundColor}; width: max-content; margin: 0 auto;">
                    <a
                        href="${url}"
                        target="_blank"
                        style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;"
                    >
                        Se Connecter
                    </a>
                </div>
                <div style="padding: 20px 0 10px 0; font-size: 12px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor}; text-align: center;">
                    Si vous n'avez pas demandé cet e-mail, vous pouvez l'ignorer en toute sécurité.
                </div>
            </div>
        </body>
    `
};

// Email text body – fallback for email clients that don't render HTML
export const text = ({ url, site }) => `Connectez-vous à ${site}\n${url}\n\n`;
