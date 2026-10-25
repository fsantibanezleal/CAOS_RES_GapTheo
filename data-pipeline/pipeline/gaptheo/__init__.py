"""Deterministic reference engine for GapTheo."""

from pathlib import Path

VERSION = (Path(__file__).resolve().parents[3] / "VERSION").read_text(encoding="utf-8").strip()
