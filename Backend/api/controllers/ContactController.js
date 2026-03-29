const nodemailer = require("nodemailer");
const { BadRequestError } = require("../errors");

// ====== Helper: HTML escape (XSS védelem) ======
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ====== Email Template ======
const getContactEmailTemplate = (name, email, message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Új üzenet - Étterem Foglalás</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#1a0a00;
  font-family:Georgia, 'Times New Roman', serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="
            background:#fff8f0;
            border-radius:8px;
            overflow:hidden;
            border:2px solid #c8860a;
          "
        >

          <!-- Fejléc -->
          <tr>
            <td align="center" style="
              background:#c8860a;
              padding:28px 32px;
            ">
              <h1 style="
                margin:0;
                font-size:22px;
                color:#fff8f0;
                letter-spacing:2px;
                text-transform:uppercase;
              ">
                🍽️ Új kapcsolatfelvétel
              </h1>
              <p style="margin:6px 0 0; font-size:13px; color:#fff3e0; letter-spacing:1px;">
                Étterem Foglalási Rendszer
              </p>
            </td>
          </tr>

          <!-- Tartalom -->
          <tr>
            <td style="padding:32px;">

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    padding:14px 16px;
                    background:#fff3e0;
                    border-radius:6px;
                    border-left:4px solid #c8860a;
                    font-size:14px;
                    color:#3e1f00;
                    margin-bottom:16px;
                    display:block;
                  ">
                    <strong style="color:#8a5000;">Feladó neve:</strong><br/>
                    <span style="font-size:16px;">Délibáb Kávézó és Street Food</span>
                  </td>
                </tr>
                <tr><td style="height:12px;"></td></tr>
                <tr>
                  <td style="
                    padding:14px 16px;
                    background:#fff3e0;
                    border-radius:6px;
                    border-left:4px solid #c8860a;
                    font-size:14px;
                    color:#3e1f00;
                  ">
                    <strong style="color:#8a5000;">Email cím:</strong><br/>
                    <span style="font-size:16px;">delibabcegled@gmail.com</span>
                  </td>
                </tr>
                <tr><td style="height:20px;"></td></tr>
                <tr>
                  <td style="
                    padding:14px 16px;
                    background:#fff3e0;
                    border-radius:6px;
                    border-left:4px solid #c8860a;
                    font-size:14px;
                    color:#3e1f00;
                  ">
                    <strong style="color:#8a5000;">Üzenet:</strong>
                    <div style="
                      margin-top:10px;
                      font-size:15px;
                      line-height:1.7;
                      color:#1a0a00;
                    ">
                      ${escapeHtml(message).replace(/\n/g, "<br/>")}
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Lábléc -->
          <tr>
            <td align="center" style="
              background:#3e1f00;
              padding:16px 32px;
              font-size:11px;
              color:#c8860a;
              letter-spacing:1px;
            ">
              Étterem Foglalási Rendszer – Automatikus értesítő email
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

// ====== Controller ======
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      throw new BadRequestError("Minden mező kitöltése kötelező.");
    }

    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      throw new Error("Email környezeti változók hiányoznak.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Étterem Foglalás" <${process.env.MAIL_USER}>`,
      to: req.user.email,
      subject: `🍽️ Új kapcsolatfelvétel - ${name}`,
      replyTo: req.user.email,
      text: `Név: ${name}\nEmail: ${req.user.email}\n\nÜzenet:\n${message}`,
      html: getContactEmailTemplate(name, req.user.email, message),
    });

    console.log("📨 Kapcsolatfelvételi email elküldve:", req.user.email);

    res.status(200).json({
      message: "Üzenet sikeresen elküldve.",
    });
  } catch (error) {
    console.error("❌ Email küldési hiba:", error.message);
    next(error);
  }
};