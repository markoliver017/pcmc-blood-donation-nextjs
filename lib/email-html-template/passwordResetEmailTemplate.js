export function getPasswordResetEmailTemplate(resetUrl, userName) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f6f6;font-family:Segoe UI,Arial,sans-serif;">
    <table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0" style="padding:0;margin:0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:32px auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04);overflow:hidden;">
            <tr>
              <td align="center" style="background:#c62828;padding:32px 16px 16px 16px;">
                <img src="${process.env.NEXT_PUBLIC_DOMAIN}/${process.env.NEXT_PUBLIC_APP_LOGO}" alt="PCMC Logo" width="72" height="72" style="display:block;margin:0 auto 12px auto;border-radius:50%;background:#fff;border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.06);" />
                <h1 style="color:#fff;font-size:1.5rem;margin:0 0 4px 0;font-weight:700;letter-spacing:0.5px;">PCMC Pediatric Blood Center</h1>
                <p style="color:#fff;font-size:1.1rem;margin:0;font-weight:400;">Password Reset Request</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px 16px 24px;">
                <p style="font-size:1.1rem;color:#222;margin:0 0 16px 0;font-weight:500;">Hello ${userName},</p>
                <p style="font-size:1rem;color:#333;margin:0 0 24px 0;line-height:1.6;">
                  We received a request to reset your password for your PCMC Pediatric Blood Center account.<br>
                  If you made this request, please click the button below to create a new password.
                </p>
                <div style="text-align:center;margin:32px 0;">
                  <a href="${resetUrl}" style="display:inline-block;padding:16px 32px;background:#c62828;color:#fff;font-size:1.1rem;font-weight:600;text-decoration:none;border-radius:8px;box-shadow:0 2px 8px rgba(198,40,40,0.15);transition:background 0.2s;">Reset My Password</a>
                </div>
                <div style="background:#fff3cd;border:1px solid #ffeeba;border-radius:8px;padding:16px 20px;margin:24px 0 0 0;">
                  <p style="margin:0;font-size:0.98rem;color:#856404;">
                    <span style="font-size:1.2em;vertical-align:middle;">&#9888;&#65039;</span>
                    <strong> Security Notice</strong><br>
                    • This password reset link will expire in <strong>1 hour</strong> for security reasons.<br>
                    • If you didn't request this password reset, please ignore this email.<br>
                    • For assistance, contact us at <a href="mailto:pcmcpediatricbloodcenter@gmail.com" style="color:#c62828;text-decoration:underline;">pcmcpediatricbloodcenter@gmail.com</a>.
                  </p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 16px 24px;text-align:center;background:#fafafa;border-top:1px solid #eee;">
                <p style="font-size:0.95rem;color:#888;margin:0 0 8px 0;">&copy; ${new Date().getFullYear()} PCMC Pediatric Blood Center</p>
                <p style="font-size:0.95rem;color:#888;margin:0;">Philippine Children's Medical Center, Quezon Ave, Quezon City, Philippines</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

module.exports = { getPasswordResetEmailTemplate }; 