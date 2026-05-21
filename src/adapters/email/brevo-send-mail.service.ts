import { brevoClient } from "@src/adapters/email/brevo.config";

interface Params {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  destEmail: string;
}

export const sendSingleRecipient = async (payload: Params) => {
  const { senderName, senderEmail, subject, body, destEmail } = payload;

  try {
    const sendSmtpEmail = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: destEmail }],
      subject,
      htmlContent: body,
    } as any;

    const response = await brevoClient.sendTransacEmail(sendSmtpEmail);

    return {
      data: {
        status: "success",
        message: "Email was sent successfully",
        response,
      },
    };
  } catch (error) {
    console.error("Brevo sendSingleRecipient error:", error);
    return { error };
  }
};
