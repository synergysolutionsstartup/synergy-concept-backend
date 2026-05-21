import { brevoClient } from "@src/adapters/email/brevo.config";

interface Recipient {
  email: string;
  name?: string;
  params: Record<string, any>;
}

interface Params {
  sender: { name: string; email: string };
  subject: string;
  htmlContent: string;
  recipients: Recipient[];
}

export const sendMultipleRecipients = async (payload: Params) => {
  const { sender, subject, htmlContent, recipients } = payload;

  try {
    if (!recipients || recipients.length === 0) {
      throw new Error("Recipients list cannot be empty.");
    }

    for (const { email, name, params } of recipients) {
      const personalizedHtml = htmlContent
        .replace(/{{workspaceName}}/g, params.workspaceName || "")
        .replace(/{{inviteeName}}/g, params.inviteeName || "")
        .replace(/{{inviterName}}/g, params.inviterName || "")
        .replace(/{{inviteLink}}/g, params.inviteLink || "");

      const sendSmtpEmail = {
        sender: { name: sender.name, email: sender.email },
        to: [{ email, name }],
        subject,
        htmlContent: personalizedHtml,
      } as any;

      await brevoClient.sendTransacEmail(sendSmtpEmail);
    }

    return { data: "success" };
  } catch (error) {
    console.error("Brevo sendMultipleRecipients error:", error);
    return { error: "Error sending emails" };
  }
};
