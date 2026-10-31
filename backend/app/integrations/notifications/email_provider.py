import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)


def envoyer_email(
    destinataire: str, sujet: str, corps_html: str, corps_texte: str | None = None
) -> bool:
    settings = get_settings()
    if not settings.email_enabled or not settings.resend_api_key:
        logger.info("EMAIL désactivé — skip %s (%s)", destinataire, sujet)
        return False

    try:
        with httpx.Client(timeout=20) as client:
            r = client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={
                    "from": settings.email_from,
                    "to": [destinataire],
                    "subject": sujet,
                    "html": corps_html,
                    "text": corps_texte or "",
                },
            )
        if r.status_code >= 400:
            logger.warning("Resend error: %s", r.text)
            return False
        return True
    except Exception as exc:
        logger.warning("Resend exception: %s", exc)
        return False