from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any


def validate(root: Path, manifest: dict[str, Any], benchmark: dict[str, Any]) -> None:
    if manifest["count"] < 12:
        raise ValueError("canonical coverage requires at least twelve scenarios")
    if benchmark["summary"]["passed"] != benchmark["summary"]["total"]:
        raise ValueError("benchmark matrix contains failed cells")
    for entry in manifest["artifacts"]:
        path = root / Path(entry["path"])
        payload = json.loads(path.read_text(encoding="utf-8"))
        expected = payload.pop("hash")
        actual = hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
        if actual != expected or actual != entry["hash"]:
            raise ValueError(f"hash drift: {path}")
        if abs(sum(item["length"] for item in payload["gaps"]) - 1) > 1e-10:
            raise ValueError(f"partition drift: {path}")
