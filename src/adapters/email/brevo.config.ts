import * as Brevo from "@getbrevo/brevo";

require("dotenv").config();

const apiKey = process.env.BREVO_API_KEY || "";
if (!apiKey) {
  throw new Error("BREVO_API_KEY is required for Brevo email sending.");
}

export const brevoClient = new Brevo.TransactionalEmailsApi();
brevoClient.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
