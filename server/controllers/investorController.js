import asyncHandler from 'express-async-handler';
import mailgun from 'mailgun-js';
import Investor from '../models/investorModel.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

  const investor = await Investor.findById(id);
  if (!investor) {
    return res.status(404).json({ message: 'Investor not found' });
  }

  const investorEmail = investor.email;
  const investorName = investor.fullname_en;

  const emailData = {
    from: investorEmail,
    to: 'zahraamazloum2001@gmail.com',
    subject: subject,
    html: `
      <div>
        ${investorName}
        <br>
        <h3>Message details: </h3>
        ${message}
      </div>
    `,
  };

  mg.messages().send(emailData, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: error.message });
    }

    console.log('Email sent successfully!');
    return res.status(201).json({ message: 'Transfer details submitted successfully' });
  });
});
