from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class InitiateResult:
    reference: str
    payment_url: str | None
    raw: dict


class PaymentProvider(ABC):
    nom: str

    @abstractmethod
    def initier(
        self, *, montant: float, devise: str, reference_interne: str, retour_url: str
    ) -> InitiateResult: ...

    @abstractmethod
    def verifier_webhook(self, payload: bytes, entetes: dict[str, str]) -> bool: ...

    @abstractmethod
    def parser_webhook(self, payload: bytes) -> dict: ...