import { Resend } from "resend";
import { render } from "@react-email/render";
import NewsletterEmail from "@/emails/NewsletterEmail";

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendArgs = React.ComponentProps<typeof NewsletterEmail> & {
  to: string | string[];
  subject: string;
  from?: string; // opcional; usa process.env.EMAIL_FROM por padrão
};

export async function sendNewsletter(args: SendArgs) {
  const { to, subject, from, ...props } = args;

  // Você pode enviar como 'react' (recomendado) ou já renderizado em HTML
  // Aqui uso 'react' para deixar o Resend fazer o render com CSS inline
  const result = await resend.emails.send({
    from: from ?? process.env.EMAIL_FROM!,
    to,
    subject,
    react: NewsletterEmail(props),
  });

  return result;
}
