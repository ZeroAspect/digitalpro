const nodemailer = require("nodemailer")

async function sendEmail(info = {}){
  const transporter = await nodemailer.createTransport({
    host: "smtp.umbler.com",
    port: 587,
    auth: {
      user: "digitalproo@digitalproo.verce.app",
      pass: "iraildes.500"
    }
  })

  try{
    const send = await transporter.sendMail({
      from: "digitalproo@digitalproo.verce.app",
      to: info.to,
      subject: info.subject,
      text: info.text
    })
    console.log(send)
    console.log("Email enviado com sucesso!")
  } catch(error){
    console.error("Erro ao enviar email:", error)
    console.error("Email não enviado!")
  }
}

module.exports = sendEmail