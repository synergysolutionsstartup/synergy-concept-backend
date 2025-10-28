import { transporter } from "@src/adapters/email/email.config";

interface Params {
  sender: { name: string; email: string };
  subject: string;
  htmlContent: string;
  recipients: { email: string; name?: string; params: Record<string, any> }[];
}

export const sendMultipleRecipients = async (payload: Params) => {
  const { subject, htmlContent, recipients, sender } = payload;

  try {
    if (!recipients || recipients.length === 0) {
      throw new Error("Recipients list cannot be empty.");
    }

    for (const { email, name, params } of recipients) {
      // Inject personalized placeholders
      const personalizedHtml = htmlContent
        .replace(/{{workspaceName}}/g, params.workspaceName || "")
        .replace(/{{inviteeName}}/g, params.inviteeName || "")
        .replace(/{{inviterName}}/g, params.inviterName || "")
        .replace(/{{inviteLink}}/g, params.inviteLink || "");

      const info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`,
        to: name ? `"${name}" <${email}>` : email,
        subject,
        html: personalizedHtml,
      });

      console.log(`Email sent to ${email}: ${info.messageId}`);
    }

    return { data: "success" };
  } catch (error) {
    console.error("Error sending emails:", error);
    return { error: "Error sending emails" };
  }
};
