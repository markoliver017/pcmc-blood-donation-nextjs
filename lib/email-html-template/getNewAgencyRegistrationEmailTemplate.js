export const getEmailToAgencyHead = (data) => {
    const {
        name: agency_name,
        first_name,
        last_name,
        email,
        contact_number,
        agency_address = "",
    } = data;
    const admin_name = `${first_name} ${last_name}`;
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        padding: 20px;
                    }

                    .email-container {
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        max-width: 600px;
                        margin: auto;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                    }

                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <p>Dear <b>${admin_name}</b>,</p>

                    <p>Thank you for registering ${agency_name} to join the <a href="${process.env.NEXT_PUBLIC_DOMAIN}"><strong>PCMC PedBC Blood Donation Portal</strong></a> as a partner in organizing mobile blood donation drives.</p>

                    <p>Your application is currently under review by our <strong>Mobile Blood Donation Team (MBDT)</strong>. Once approved, you will receive a confirmation email with instructions on how to access your account.</p>

                    <p><strong>Note:</strong> You will not be able to log in or use the platform until your registration has been approved.</p>

                    <p><strong>Agency Details:</strong></p>
                    <ul>
                        <li><strong>Name:</strong> ${agency_name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Contact Number:</strong> +63${contact_number}</li>
                        <li><strong>Address:</strong> ${agency_address}</li>
                    </ul>

                    <p>If you have any questions, feel free to reply to this email.</p>

                    <br>
                    <p>Thank you,<br>
                    <strong>PCMC Pediatric Blood Center</strong></p>
        

                    <p class="footer">
                        Please do not reply to this automated message. For any clarifications, contact us at <a href="${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}">support@pcmc.gov.ph</a>.
                    </p>
                </div>
            </body>
        </html>
    `;
};

export const getEmailToMBDT = (data) => {
    const {
        name: agency_name,
        first_name,
        last_name,
        email,
        contact_number,
        agency_address = "",
    } = data;
    const admin_name = `${first_name} ${last_name}`;
    return `
    <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        padding: 20px;
                    }

                    .email-container {
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 8px;
                        max-width: 600px;
                        margin: auto;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                    }

                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h2>New Agency Registration Alert</h2>
                    <p>Dear MBDT,</p>

                    <p>A new agency has submitted a registration request on our <a href="${process.env.NEXT_PUBLIC_DOMAIN}"><strong>PCMC PedBC Blood Donation Portal</strong></a>.</p>

                    <p><strong>Agency Details:</strong></p>
                    <ul>
                        <li><strong>Name:</strong> ${agency_name}</li>
                        <li><strong>Registered By:</strong> ${admin_name}</li>
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Contact Number:</strong> +63${contact_number}</li>
                        <li><strong>Address:</strong> ${agency_address}</li>
                    </ul>

                    <p>Please log in to review and approve or reject this request.</p>

                    <br>
                    <p>Thank you,<br>
                    <strong>Blood Donation Portal System</strong></p>
                </div>
            </body>
        </html>

    `;
};
