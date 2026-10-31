from math import ceil


def build_paginated(items, total, page: int, taille: int) -> dict:
    return {
        "items": items,
        "total": total,
        "page": page,
        "taille": taille,
        "pages": ceil(total / taille) if total else 0,
    }