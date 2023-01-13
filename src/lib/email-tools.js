import sgMail from "@sendgrid/mail";

export const sendRegistrationEmail = async (recipientAddress) => {
  sgMail.setApiKey(process.env.SENDGRID_KEY);
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hello first email sent!",
    text: "i came and i saw and i won",
    html: "<strong>i came and i saw and i won</strong>",
  };
  await sgMail.send(msg);
};
