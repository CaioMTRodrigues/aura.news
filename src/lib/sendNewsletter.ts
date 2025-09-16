import { Resend } from "resend";
import NewsletterEmail from "@/emails/NewsletterEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendArgs = React.ComponentProps<typeof NewsletterEmail> & {
  to: string | string[];
  subject: string;
  from?: string;
};

export async function sendNewsletter(args: SendArgs) {
  const { to, subject, from, ...props } = args;
  return resend.emails.send({
    from: from ?? process.env.EMAIL_FROM!,
    to,
    subject,
    react: NewsletterEmail(props),
  });
}
