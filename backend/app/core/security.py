import hashlib
import hmac
import secrets


def generate_token() -> str:
    """Return a cryptographically secure token suitable for a browser cookie."""
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    """Hash credentials before persistence so a database leak does not expose them."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def tokens_match(first: str, second: str) -> bool:
    return hmac.compare_digest(first, second)
