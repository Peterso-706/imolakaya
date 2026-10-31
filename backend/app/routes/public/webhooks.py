from fastapi import APIRouter, Header, Request

from app.core.deps import DbSession
from app.core.exceptions import BadRequestError
from app.core.config import get_settings
from app.integrations.payments import get_provider
from app.services import paiement_service

router = APIRouter()


@router.post("/webhooks/paiements/{fournisseur}", include_in_schema=False)
async def recevoir_webhook(
    fournisseur: str,
    request: Request,
    db: DbSession,
    x_signature: str | None = Header(default=None, alias="X-Signature"),
):
    body = await request.body()
    entetes = {k.lower(): v for k, v in request.headers.items()}

    provider = get_provider(fournisseur)
    signature_valide = provider.verifier_webhook(body, entetes)
    if not signature_valide:
        raise BadRequestError("Signature invalide")

    data = provider.parser_webhook(body)

    # Normalisation minimale selon le fournisseur
    reference = (
        data.get("orderId")
        or data.get("reference")
        or data.get("order_id")
    )
    reference_fournisseur = (
        data.get("transactionId")
        or data.get("transaction_id")
        or data.get("payment_token")
        or reference
    )
    statut = (
        data.get("status")
        or data.get("statut")
        or data.get("payment_status")
    )

    if not reference or not statut:
        raise BadRequestError("Payload webhook incomplet")

    paiement_service.traiter_webhook(
        db,
        reference=reference,
        reference_fournisseur=str(reference_fournisseur),
        statut_fournisseur=str(statut).lower(),
        preuve=data,
        signature_valide=True,
    )
    return {"received": True}