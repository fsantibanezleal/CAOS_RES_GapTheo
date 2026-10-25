from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from jsonschema import Draft202012Validator
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012

ROOT = Path(__file__).resolve().parents[2]
CONTRACTS = ROOT / "docs" / "contracts"
SCHEMAS = ROOT / "contracts"
OPENAPI = CONTRACTS / "api.openapi.json"
FIXTURE_ROOT = CONTRACTS / "fixtures"
DERIVED_ROOTS = {"bake": ROOT / "data" / "derived", "fixture": FIXTURE_ROOT / "data" / "derived"}
BASE = "https://contracts.invalid/"


def load_json(path: str | Path) -> Any:
    return json.loads(Path(path).read_text(encoding="utf-8"))


@lru_cache(maxsize=None)
def registry() -> Registry:
    """Resolve the committed JSON Schemas locally; never fetch a network reference."""
    resources = [(f"{BASE}schemas/{f.name}", Resource.from_contents(load_json(f), default_specification=DRAFT202012))
                 for f in sorted(SCHEMAS.glob("*.schema.json"))]
    if OPENAPI.is_file():
        resources.append((f"{BASE}api.openapi.json", Resource.from_contents(load_json(OPENAPI), default_specification=DRAFT202012)))
    return Registry().with_resources(resources)


def _validator_for(ref: str) -> Draft202012Validator:
    return Draft202012Validator({"$schema": "https://json-schema.org/draft/2020-12/schema", "$ref": ref},
                                registry=registry())


@lru_cache(maxsize=None)
def validator(name: str) -> Draft202012Validator:
    """The validator for the named schema in the contract catalog."""
    path = SCHEMAS / f"{name}.schema.json"
    Draft202012Validator.check_schema(load_json(path))
    return _validator_for(f"{BASE}schemas/{path.name}")


def errors(name: str, instance: Any) -> list[str]:
    return _messages(validator(name), instance)


def _messages(v: Draft202012Validator, instance: Any) -> list[str]:
    found = sorted(v.iter_errors(instance), key=lambda e: [str(p) for p in e.absolute_path])
    return [f"{'/'.join(str(p) for p in e.absolute_path) or '$'}: {e.message}" for e in found]


def component_errors(name: str, instance: Any) -> list[str]:
    return _messages(_validator_for(f"{BASE}api.openapi.json#/components/schemas/{name}"), instance)


def _escape(token: str) -> str:
    return token.replace("~", "~0").replace("/", "~1")


@lru_cache(maxsize=None)
def response_validator(path: str, method: str, status: int) -> Draft202012Validator:
    doc = load_json(OPENAPI)
    response = doc["paths"][path][method.lower()]["responses"][str(status)]
    pointer = "/" + "/".join(_escape(t) for t in ("paths", path, method.lower(), "responses", str(status)))
    if "$ref" in response:
        ref = response["$ref"]
        if not ref.startswith("#/"):
            raise ValueError(f"{method} {path} {status}: only local response references are supported, got {ref}")
        pointer = ref[1:]
    return _validator_for(f"{BASE}api.openapi.json#{pointer}/content/application~1json/schema")


def response_errors(path: str, method: str, status: int, body: Any) -> list[str]:
    return _messages(response_validator(path, method, status), body)
