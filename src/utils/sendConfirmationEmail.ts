import emailjs from "@emailjs/browser";
import type { Client } from "../types";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const TEMPLATE_FEEDBACK_ID = import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendEmail(
  params: Pick<Client, "name" | "email">,
  type: "feedback" | "confirmation" = "confirmation"
): Promise<void> {
  const template = type == "confirmation" ? TEMPLATE_ID : TEMPLATE_FEEDBACK_ID;
  await emailjs.send(
    SERVICE_ID,
    template,
    {
      name: params.name,
      to_email: params.email,
    },
    PUBLIC_KEY
  );
}
