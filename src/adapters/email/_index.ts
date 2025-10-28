import { sendSingleRecipient } from "@src/adapters/email/send-mail.service";
import { sendMultipleRecipients } from "@src/adapters/email/send-multiple-recipients.service";

export const emailService = {
  sendSingleRecipient,
  sendMultipleRecipients
};
