import { HttpStatusCode } from "axios";
import ApiError from "../../errors/ApiErrors";
import { sendEmail } from "./brevo.config";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  CONTACT_FORM_TEMPLATE,
  PARTNER_CONTACT_FORM_TEMPLATE,
} from "./emailTemplates";

export const sendVerificationEmail = async (to: string, token: string) => {
  const template = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    token
  );

  const response = await sendEmail(
    [{ email: to }],
    "Verify Your Account",
    template
  );

  console.log(response);

  return response;
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const template = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);
  const response = await sendEmail(
    [{ email: to }],
    "Welcome to Your App",
    template
  );

  return response;
};

//forgot password

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const template = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", token);
  const response = await sendEmail(
    [{ email: to }],
    "Password Reset Request",
    template
  );

  return response;
};

export const sendPasswordResetSuccessEmail = async (to: string) => {
  const template = PASSWORD_RESET_SUCCESS_TEMPLATE;

  const response = await sendEmail(
    [{ email: to }],
    "Password Reset Success",
    template
  );

  return response;
};

export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  phone: string,
  message: string
) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  console.log(adminEmail);

  if (!adminEmail) {
    throw new ApiError(
      HttpStatusCode.InternalServerError,
      "Admin email not configured."
    );
  }

  // Fill in template placeholders
  const template = CONTACT_FORM_TEMPLATE.replace(/{name}/g, name)
    .replace(/{subject}/g, subject)
    .replace(/{message}/g, message)
    .replace(/{email}/g, email)
    .replace(/{phone}/g, phone);

  // Send the email to admin
  const response = await sendEmail(
    [{ email: "sixir94359@iridales.com" }],
    `New Contact Message: ${subject}`,
    template
  );

  console.log(`Contact email sent. Response:`, response);

  return response;
};

export const sendContactEmailToPartners = async (
  to: string,
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  // Fill in template placeholders
  const template = PARTNER_CONTACT_FORM_TEMPLATE.replace(/{name}/g, name)
    .replace(/{subject}/g, subject)
    .replace(/{message}/g, message)
    .replace(/{email}/g, email);

  // Send the email to admin
  const response = await sendEmail(
    [{ email: to }],
    `New Contact Message: ${subject}`,
    template
  );

  console.log(`Contact email sent. Response:`, response);

  return response;
};
