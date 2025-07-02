export const baseEmailTemplate = ({ title = "", body, footer = "" }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; }
    .email-container { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
    .footer { margin-top: 30px; font-size: 12px; color: #777; }
    h2 { color: #d32f2f; }
  </style>
</head>
<body>
  <div class="email-container">
    ${title ? `<h2>${title}</h2>` : ""}
    ${body}
    ${footer ? `<p class="footer">${footer}</p>` : ""}
  </div>
</body>
</html>
`; 