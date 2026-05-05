import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendDownloadEmail(email, customerName, downloadLinks, orderUuid) {
  const linkItems = downloadLinks.map(link => `
    <li style="margin-bottom: 12px;">
      <strong>${link.productTitle}</strong><br/>
      <a href="${link.url}" style="color: #e84393;">Download now</a>
      <span style="font-size: 12px; color: #7f8c8d;"> (expires in ${link.expiresHours}h, ${link.remaining} downloads left)</span>
    </li>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Helvetica', Arial, sans-serif; background: #f9f0f5; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h1 style="color: #9b59b6; margin-top: 0;">Thank you, ${customerName || 'dancer'}! 💃</h1>
        <p>Your order <strong style="color: #e84393;">#${orderUuid}</strong> is confirmed.</p>
        <p>Your digital files are ready. Click the links below to download (each link works for ${downloadLinks[0]?.expiresHours || 24} hours):</p>
        <ul style="list-style: none; padding-left: 0;">
          ${linkItems}
        </ul>
        <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 24px 0;" />
        <p style="font-size: 12px; color: #bdc3c7;">If the links expire, you can re-download from our <a href="${process.env.FRONTEND_URL}/lookup" style="color: #9b59b6;">order lookup page</a>.</p>
        <p style="font-size: 12px; color: #bdc3c7;">© Gina Ballerina – All dances reserved.</p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Gina Ballerina" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Your digital downloads are ready! 🎁',
    html,
  });
}