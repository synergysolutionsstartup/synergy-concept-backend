export const sendVerificationEmail = async ({
  constants,
  token,
  userFirstName,
  userEmail,
  sendEmail,
  getEmailTemplate,
}: any) => {
  try {
    const { mailProps, verifyAccountMailContent } = constants;

    // CREATE THE VERIFICATION LINK
    const verificationLink = verifyAccountMailContent.url + token;

    // SETUP THE EMAIL TEMPLATE
    const templatePayload = {
      ...verifyAccountMailContent,
      url: verificationLink,
      receiverName: userFirstName,
    };
    const emailBody = getEmailTemplate(templatePayload);

    const mailServicePayload = {
      senderName: mailProps.appName,
      senderEmail: mailProps.appEmail,
      subject: verifyAccountMailContent.header,
      body: emailBody,
      destEmail: userEmail,
    };

    // NEXT SEND EMAIL TO THE USER CONTAINEING THE VERIFICATION LINK
    const isSent = await sendEmail(mailServicePayload);
    if (isSent.error) return { error: true };
    return { data: true };
  } catch (error) {
    console.log("sendVerificationEmail error", error);
    return { error };
  }
};
