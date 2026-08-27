"""SendGrid transactional email helpers for NEW SAINT VÉRON lead notifications.

Secrets live in environment variables only. If SENDGRID_API_KEY is not
configured the send is skipped gracefully so the site keeps working
(the lead is still persisted to the database).
"""
import os
import logging
import html

logger = logging.getLogger(__name__)


def _esc(value: str) -> str:
    return html.escape((value or "").strip())


def is_email_enabled() -> bool:
    return bool(os.environ.get("SENDGRID_API_KEY", "").strip())


def build_lead_email_html(lead: dict) -> str:
    rows = [
        ("Nome", lead.get("name", "")),
        ("E-mail", lead.get("email", "")),
        ("Empresa", lead.get("company") or "—"),
        ("Telefone", lead.get("phone") or "—"),
    ]
    row_html = "".join(
        f"<tr>"
        f"<td style='padding:8px 16px;color:#A3A3A3;font-size:13px;"
        f"border-bottom:1px solid #1C1C1C;width:120px'>{_esc(label)}</td>"
        f"<td style='padding:8px 16px;color:#F5F5F0;font-size:14px;"
        f"border-bottom:1px solid #1C1C1C'>{_esc(str(val))}</td>"
        f"</tr>"
        for label, val in rows
    )
    message = _esc(lead.get("message", "")).replace("\n", "<br>")
    return f"""
    <div style="background:#0A0A0A;padding:32px;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:560px;margin:0 auto;background:#0F0F10;border:1px solid #1C1C1C;border-radius:4px;overflow:hidden">
        <div style="padding:28px 32px;border-bottom:1px solid #1C1C1C">
          <p style="margin:0;letter-spacing:3px;font-size:11px;color:#D4AF37;text-transform:uppercase">NEW SAINT VÉRON</p>
          <h1 style="margin:8px 0 0;color:#F5F5F0;font-size:22px;font-weight:600">Novo lead recebido</h1>
        </div>
        <table style="width:100%;border-collapse:collapse">{row_html}</table>
        <div style="padding:20px 32px">
          <p style="margin:0 0 8px;color:#A3A3A3;font-size:13px">Mensagem</p>
          <p style="margin:0;color:#F5F5F0;font-size:14px;line-height:1.6">{message}</p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #1C1C1C">
          <p style="margin:0;color:#666;font-size:11px">Enviado automaticamente pelo formulário do site.</p>
        </div>
      </div>
    </div>
    """


def send_lead_notification(lead: dict) -> bool:
    """Send a lead notification email. Returns True on success, False otherwise."""
    api_key = os.environ.get("SENDGRID_API_KEY", "").strip()
    sender = os.environ.get("SENDER_EMAIL", "").strip()
    recipient = os.environ.get("LEAD_NOTIFICATION_EMAIL", "").strip()

    if not api_key or not sender or not recipient:
        logger.info("Email skipped: SendGrid not fully configured. Lead persisted only.")
        return False

    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail

        message = Mail(
            from_email=sender,
            to_emails=recipient,
            subject="Novo lead — NEW SAINT VÉRON",
            html_content=build_lead_email_html(lead),
        )
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        ok = response.status_code in (200, 201, 202)
        logger.info("Lead notification email dispatched (status=%s)", response.status_code)
        return ok
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to send lead notification email: %s", type(exc).__name__)
        return False
