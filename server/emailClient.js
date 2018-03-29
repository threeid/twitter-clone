const nodemailer = require('nodemailer')

module.exports = new class EmailClient {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: '',
        pass: ''
      }
    })
  }

  sendVerification(name, email, link, forgetPassword = false) {
    let subject = 'Xác thực tài khoản tại Twitter'

    if (forgetPassword) subject = 'Tạo lại mật khẩu mới Twitter'

    let message = {
      from: 'Admin <threeid@outlook.com>',
      to: `${name} ${email}`,
      subject,
      text: `Hãy nhấn truy cập hoặc dán link này vào trình duyệt: ${link}`,
      html: `Hãy nhấn truy cập hoặc dán link này vào trình duyệt: <a href="${link}">${link}</a>`
    }

    this.transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('sendMail: ', err)
        return
      }

      console.log('sendVerification ', info.messageId)
    })
  }
}()
