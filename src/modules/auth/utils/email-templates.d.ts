export function buildVerificationEmail(
  email: string,
  verificationToken: string
): {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export function buildPasswordResetEmail(
  email: string,
  resetToken: string
): {
  to: string;
  subject: string;
  text: string;
  html: string;
};
