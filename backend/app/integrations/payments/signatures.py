import hmac
from hashlib import sha256


def hmac_sha256(secret: str, payload: bytes) -> str:
    return hmac.new(secret.encode(), payload, sha256).hexdigest()


def verifier_signature_hmac(
    secret: str, payload: bytes, signature_recue: str
) -> bool:
    attendue = hmac_sha256(secret, payload)
    return hmac.compare_digest(attendue, signature_recue or "")