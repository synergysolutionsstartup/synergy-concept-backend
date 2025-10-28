import { createSaveAndSendVerificationToken } from "@src/modules/auth/service/create-save-send-verification-token";
import { sendVerificationEmail } from "@src/modules/auth/service/send-verification-email";

export const services = {
    sendVerificationEmail,
    createSaveAndSendVerificationToken
}
