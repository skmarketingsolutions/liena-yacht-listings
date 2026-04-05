import nodemailer from 'nodemailer';

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[Email] SMTP not configured — emails will be logged to console only.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  listingTitle?: string;
  listingSlug?: string;
  toEmail: string;
}

export async function sendLeadEmail(lead: LeadData): Promise<boolean> {
  const transporter = createTransporter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lienayperez.com';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Liena Q Perez';

  const listingUrl = lead.listingSlug ? `${siteUrl}/listings/${lead.listingSlug}` : siteUrl;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #0b1829; color: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #0f2035; border: 1px solid #c9a84c; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0b1829 0%, #132540 100%); padding: 32px; text-align: center; border-bottom: 2px solid #c9a84c; }
    .header h1 { color: #c9a84c; font-size: 28px; margin: 0; letter-spacing: 2px; }
    .header p { color: #8a9ab5; margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .alert { background: #c9a84c; color: #0b1829; padding: 12px 20px; border-radius: 4px; font-weight: bold; margin-bottom: 24px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
    .field { margin-bottom: 20px; }
    .field label { display: block; color: #8a9ab5; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
    .field .value { color: #f5f5f5; font-size: 18px; }
    .message-box { background: #0b1829; border: 1px solid #2a3d52; border-radius: 4px; padding: 16px; color: #d0d8e4; font-size: 15px; line-height: 1.6; }
    .cta { display: inline-block; background: #c9a84c; color: #0b1829; padding: 14px 28px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 24px; letter-spacing: 1px; }
    .footer { background: #091422; padding: 20px 32px; text-align: center; border-top: 1px solid #1a2d42; }
    .footer p { color: #5a7a9a; font-size: 12px; margin: 4px 0; }
    .divider { border: none; border-top: 1px solid #1a2d42; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LIENA Q PEREZ</h1>
      <p>New Lead Notification</p>
    </div>
    <div class="body">
      <div class="alert">🔔 New Inquiry — Action Required</div>
      ${lead.listingTitle ? `<div class="field"><label>Listing</label><div class="value">${lead.listingTitle}</div></div>` : ''}
      <div class="field"><label>Full Name</label><div class="value">${lead.name}</div></div>
      <div class="field"><label>Email</label><div class="value"><a href="mailto:${lead.email}" style="color:#c9a84c;">${lead.email}</a></div></div>
      <div class="field"><label>Phone</label><div class="value"><a href="tel:${lead.phone}" style="color:#c9a84c;">${lead.phone}</a></div></div>
      ${lead.message ? `<div class="field"><label>Message</label><div class="message-box">${lead.message}</div></div>` : ''}
      <hr class="divider">
      <a href="${listingUrl}" class="cta">VIEW LISTING →</a>
    </div>
    <div class="footer">
      <p>${siteName} &bull; Miami, Florida</p>
      <p>This lead was submitted via your website listing form.</p>
    </div>
  </div>
</body>
</html>`;

  const mailOptions = {
    from: `"${siteName} Leads" <${process.env.SMTP_USER}>`,
    to: lead.toEmail,
    subject: `🛥 New Lead${lead.listingTitle ? ` — ${lead.listingTitle}` : ''}: ${lead.name} (${lead.phone})`,
    html: htmlBody,
    text: `New Inquiry from ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\n${lead.message ? `Message: ${lead.message}\n` : ''}${lead.listingTitle ? `Listing: ${lead.listingTitle}\n` : ''}`,
  };

  if (!transporter) {
    console.log('[Email] Would have sent lead email:', mailOptions.text);
    return true;
  }

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send lead email:', err);
    return false;
  }
}
