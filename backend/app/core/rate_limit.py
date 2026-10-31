from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import Request

from app.core.config import get_settings
from app.core.exceptions import TooManyRequestsError

_buckets: dict[str, list[datetime]] = defaultdict(list)


def rate_limit(scope: str, max_per_minute: int | None = None):
    def _dep(request: Request) -> None:
        settings = get_settings()
        limit = max_per_minute or settings.rate_limit_per_minute
        ip = request.client.host if request.client else "unknown"
        key = f"{scope}:{ip}"
        now = datetime.now(timezone.utc)
        window = now - timedelta(minutes=1)
        _buckets[key] = [t for t in _buckets[key] if t > window]
        if len(_buckets[key]) >= limit:
            raise TooManyRequestsError("Trop de requêtes, réessayez plus tard")
        _buckets[key].append(now)
    return _dep