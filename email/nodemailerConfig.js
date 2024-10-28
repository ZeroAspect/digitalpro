const nodemailer = require("nodemailer")

async function sendEmail(info = {}){
  const transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "joseiraildesciprianoribeiro@gmail.com",
      pass: "ZORRO_FF"
    }
  })

  try{
    const send = await transporter.sendMail({
      from: "joseiraildesciprianoribeiro@gmail.com",
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