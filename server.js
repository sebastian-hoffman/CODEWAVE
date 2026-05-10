const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = Number(process.env.PORT || 8080);
const rootDir = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(rootDir, {
  extensions: ["html"],
  maxAge: "7d"
}));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  const nombre = String(req.body.nombre || "").trim();
  const empresa = String(req.body.empresa || "").trim();
  const email = String(req.body.email || "").trim();
  const mensaje = String(req.body.mensaje || "").trim();

  if (!nombre || !empresa || !email || !mensaje) {
    return res.status(400).json({ ok: false, message: "Completá todos los campos obligatorios." });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = String(process.env.SMTP_SECURE || "false") === "true";
  const contactTo = process.env.CONTACT_TO;
  const contactFrom = process.env.CONTACT_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !contactTo || !contactFrom) {
    return res.status(500).json({
      ok: false,
      message: "El formulario no está configurado todavía. Falta definir variables SMTP en el servidor."
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: contactFrom,
      to: contactTo,
      replyTo: email,
      subject: `Nueva consulta web - ${empresa}`,
      text:
        `Nombre: ${nombre}\n` +
        `Empresa: ${empresa}\n` +
        `Email: ${email}\n\n` +
        `Proceso a mejorar:\n${mensaje}`,
      html:
        `<p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>` +
        `<p><strong>Empresa:</strong> ${escapeHtml(empresa)}</p>` +
        `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        `<p><strong>Proceso a mejorar:</strong></p>` +
        `<p>${escapeHtml(mensaje).replace(/\n/g, "<br />")}</p>`
    });

    return res.json({ ok: true, message: "Consulta enviada. Te responderemos a la brevedad." });
  } catch (error) {
    console.error("Contact form error", error);
    return res.status(500).json({
      ok: false,
      message: "No pudimos enviar la consulta en este momento. Intentá nuevamente en unos minutos."
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Codewave site listening on port ${port}`);
});

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
