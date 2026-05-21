import { sendSingleRecipient as sendSingleRecipientBrevo } from "@src/adapters/email/brevo-send-mail.service";
import { sendMultipleRecipients as sendMultipleRecipientsBrevo } from "@src/adapters/email/brevo-send-multiple-recipients.service";

export const emailService = {
  sendSingleRecipient: sendSingleRecipientBrevo,
  sendMultipleRecipients: sendMultipleRecipientsBrevo,
};
