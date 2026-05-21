export const sendVerificationEmail = async ({
  token,
  userEmail,
  sendEmail,
  getEmailTemplate,
  senderName,
  senderEmail,
}: any) => {
  try {
    const emailPayload = getEmailTemplate(userEmail, token);

    const mailServicePayload = {
      senderName,
      senderEmail,
      subject: emailPayload.subject,
      body: emailPayload.html,
      destEmail: userEmail,
    };

    const isSent = await sendEmail(mailServicePayload);
    if (isSent.error) return { error: true };
    return { data: true };
  } catch (error) {
    console.log("sendVerificationEmail error", error);
    return { error };
  }
};
