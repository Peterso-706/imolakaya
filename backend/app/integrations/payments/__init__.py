from app.integrations.payments.base import InitiateResult, PaymentProvider

_PROVIDERS: dict[str, type[PaymentProvider]] = {}


def _registry() -> dict[str, type[PaymentProvider]]:
    if not _PROVIDERS:
        from app.integrations.payments.moncash_provider import MonCashProvider
        from app.integrations.payments.natcash_provider import NatCashProvider
        _PROVIDERS["moncash"] = MonCashProvider
        _PROVIDERS["natcash"] = NatCashProvider
    return _PROVIDERS


def get_provider(nom: str) -> PaymentProvider:
    cls = _registry().get(nom.lower())
    if cls is None:
        from app.core.exceptions import BadRequestError
        raise BadRequestError(f"Fournisseur de paiement inconnu : {nom}")
    return cls()


__all__ = ["PaymentProvider", "InitiateResult", "get_provider"]