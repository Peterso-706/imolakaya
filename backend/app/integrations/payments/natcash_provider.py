import json

import httpx

from app.core.config import get_settings
from app.core.exceptions import BadRequestError
from app.integrations.payments.base import InitiateResult, PaymentProvider
from app.integrations.payments.signatures import verifier_signature_hmac


class NatCashProvider(PaymentProvider):
    nom = "natcash"

    def __init__(self) -> None:
        self.settings = get_settings()

    def initier(
        self, *, montant: float, devise: str, reference_interne: str, retour_url: str
    ) -> InitiateResult:
        url = f"{self.settings.natcash_api_url}/payments/initiate"
        with httpx.Client(timeout=20) as client:
            r = client.post(
                url,
                headers={"X-Api-Key": self.settings.natcash_api_key or ""},
                json={
                    "amount": montant,
                    "currency": devise,
                    "reference": reference_interne,
                    "redirect_url": retour_url,
                },
            )
        if r.status_code >= 400:
            raise BadRequestError(f"NatCash error: {r.text}")
        data = r.json()
        return InitiateResult(
            reference=data.get("reference", reference_interne),
            payment_url=data.get("checkout_url"),
            raw=data,
        )

    def verifier_webhook(self, payload: bytes, entetes: dict[str, str]) -> bool:
        secret = self.settings.natcash_webhook_secret or ""
        if not secret:
            return False
        return verifier_signature_hmac(
            secret, payload, entetes.get("x-natcash-signature", "")
        )

    def parser_webhook(self, payload: bytes) -> dict:
        return json.loads(payload.decode())