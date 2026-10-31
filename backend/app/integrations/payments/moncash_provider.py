import base64

import httpx

from app.core.config import get_settings
from app.core.exceptions import BadRequestError
from app.integrations.payments.base import InitiateResult, PaymentProvider
from app.integrations.payments.signatures import verifier_signature_hmac


class MonCashProvider(PaymentProvider):
    nom = "moncash"

    def __init__(self) -> None:
        self.settings = get_settings()

    def _basic_auth(self) -> str:
        raw = f"{self.settings.moncash_client_id}:{self.settings.moncash_client_secret}"
        return base64.b64encode(raw.encode()).decode()

    def _get_token(self) -> str:
        url = f"{self.settings.moncash_api_url}/oauth/token"
        with httpx.Client(timeout=20) as client:
            r = client.post(
                url,
                headers={
                    "Authorization": f"Basic {self._basic_auth()}",
                    "Accept": "application/json",
                },
                data={"scope": "read,write", "grant_type": "client_credentials"},
            )
        if r.status_code >= 400:
            raise BadRequestError(f"MonCash auth error: {r.text}")
        return r.json()["access_token"]

    def initier(
        self, *, montant: float, devise: str, reference_interne: str, retour_url: str
    ) -> InitiateResult:
        token = self._get_token()
        url = f"{self.settings.moncash_api_url}/v1/CreatePayment"
        with httpx.Client(timeout=20) as client:
            r = client.post(
                url,
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "amount": montant,
                    "orderId": reference_interne,
                },
            )
        if r.status_code >= 400:
            raise BadRequestError(f"MonCash create error: {r.text}")
        data = r.json()
        return InitiateResult(
            reference=data.get("payment_token", reference_interne),
            payment_url=data.get("redirect_url"),
            raw=data,
        )

    def verifier_webhook(self, payload: bytes, entetes: dict[str, str]) -> bool:
        secret = self.settings.moncash_webhook_secret or ""
        if not secret:
            return False
        return verifier_signature_hmac(
            secret, payload, entetes.get("x-moncash-signature", "")
        )

    def parser_webhook(self, payload: bytes) -> dict:
        import json
        return json.loads(payload.decode())