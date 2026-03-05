import emailjs from "@emailjs/browser";
import type { Client } from "../types";

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


export async function sendConfirmationEmail(params: Pick< Client, 'name' | 'email'>): Promise<void> {
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      name:   params.name,
      to_email:      params.email,
    },
    PUBLIC_KEY
  );
}