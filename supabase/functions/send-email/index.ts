// supabase/functions/send-email/index.ts
// Motor de correos transaccional personalizado para Obsidiana Joyería.
// Usa Nodemailer (npm:nodemailer) con SMTP de Gmail en puerto 587 (STARTTLS).
// Requiere JWT válido + perfil activo en tabla `profiles` para autorizar el envío.
// Soporta: hasta 20 destinatarios, HTML enriquecido, hasta 10 adjuntos en Base64.
// Variables de entorno requeridas en Supabase Secrets:
//   GMAIL_USER          → correo de Gmail (ej: jamesrojasdiaz01@gmail.com)
//   GMAIL_APP_PASSWORD  → contraseña de aplicación de Google (no la contraseña normal)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Attachment {
  filename: string;
  content: string;      // Base64 encoded
  contentType: string;  // MIME type, ej: "application/pdf"
}

interface EmailPayload {
  to: string | string[];   // hasta 20 destinatarios
  subject: string;
  html: string;
  attachments?: Attachment[]; // hasta 10 adjuntos
}

Deno.serve(async (req: Request) => {
  // Manejar preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ─────────────────────────────────────────────────
    // 1. VERIFICAR JWT — Obtener usuario autenticado
    // ─────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Token requerido" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jwt = authHeader.replace("Bearer ", "");

    // Cliente con service role para verificar el JWT y consultar profiles
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Token inválido o expirado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─────────────────────────────────────────────────
    // 2. VERIFICAR PERFIL ACTIVO en tabla `profiles`
    // ─────────────────────────────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("active")
      .eq("id", user.id)
      .maybeSingle();

    // Si no existe tabla profiles o el perfil no está activo → Forbidden
    if (profileError || !profile || !profile.active) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Perfil inactivo o sin permisos" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─────────────────────────────────────────────────
    // 3. PARSEAR Y VALIDAR PAYLOAD
    // ─────────────────────────────────────────────────
    const body: EmailPayload = await req.json();
    const { to, subject, html, attachments } = body;

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos: to, subject, html" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];

    if (recipients.length > 20) {
      return new Response(
        JSON.stringify({ error: "Máximo 20 destinatarios por llamada" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (attachments && attachments.length > 10) {
      return new Response(
        JSON.stringify({ error: "Máximo 10 archivos adjuntos permitidos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ─────────────────────────────────────────────────
    // 4. CONFIGURAR NODEMAILER con Gmail SMTP (puerto 587 / STARTTLS)
    // ─────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS — NO SSL directo
      auth: {
        user: Deno.env.get("GMAIL_USER"),
        pass: Deno.env.get("GMAIL_APP_PASSWORD"),
      },
    });

    // ─────────────────────────────────────────────────
    // 5. ENVIAR CORREO
    // ─────────────────────────────────────────────────
    const mailOptions = {
      from: `"Obsidiana Joyería" <${Deno.env.get("GMAIL_USER")}>`,
      to: recipients.join(", "),
      subject,
      html,
      attachments: attachments?.map((att: Attachment) => ({
        filename: att.filename,
        content: att.content,
        encoding: "base64",
        contentType: att.contentType,
      })),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`[send-email] Correo enviado OK → ${recipients.join(", ")} | messageId: ${info.messageId}`);

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[send-email] Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
