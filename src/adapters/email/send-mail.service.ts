import { transporter } from "@src/adapters/email/email.config";


interface Params {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  destEmail: string;
}

export const sendSingleRecipient = async (payload: Params) => {
  const { senderName, senderEmail, subject, body, destEmail } = payload;

  // console.log("sendToSingleRecipient Payload ", payload)

  try {
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`, // sender address
      to: destEmail, // single recipient
      subject,
      html: body,
    });

    return {
      data: {
        status: "success",
        messageId: info.messageId,
        body: "Email was sent successfully",
      },
    };
  } catch (error) {
    console.error("Nodemailer sendSingleRecipient error:", error);
    return { error };
  }
};
