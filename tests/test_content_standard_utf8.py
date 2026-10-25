from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path


def test_emoji_diagnostic_is_utf8_when_captured_through_ansi_pipe(tmp_path: Path) -> None:
    git = shutil.which("git")
    assert git
    (tmp_path / "scripts").mkdir()
    source = Path(__file__).resolve().parents[1] / "scripts" / "check_content_standards.py"
    shutil.copyfile(source, tmp_path / "scripts" / "check_content_standards.py")
    planted = tmp_path / "content.txt"
    planted.write_text("diagnostic " + chr(0x1F680) + "\n", encoding="utf-8")
    subprocess.run([git, "init", "-q"], cwd=tmp_path, check=True)
    subprocess.run([git, "add", "scripts/check_content_standards.py", "content.txt"], cwd=tmp_path, check=True)
    environment = os.environ.copy()
    environment["PYTHONIOENCODING"] = "cp1252"
    result = subprocess.run(
        [sys.executable, "scripts/check_content_standards.py"],
        cwd=tmp_path,
        env=environment,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    output = result.stdout.decode("utf-8")
    assert result.returncode == 1
    assert "content.txt:1:12" in output
    assert "U+1F680" in output
