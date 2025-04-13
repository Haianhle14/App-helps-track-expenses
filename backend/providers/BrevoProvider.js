const SibApiV3Sdk = require('@getbrevo/brevo')

// Khởi tạo instance của API Brevo
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = process.env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Khởi tạo object gửi email
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  sendSmtpEmail.sender = {
    email: process.env.ADMIN_EMAIL_ADDRESS,
    name: process.env.ADMIN_EMAIL_NAME
  }

  sendSmtpEmail.to = [{ email: recipientEmail }]
  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = htmlContent

  return await apiInstance.sendTransacEmail(sendSmtpEmail)
}

module.exports = {
  BrevoProvider: {
    sendEmail
  }
}
