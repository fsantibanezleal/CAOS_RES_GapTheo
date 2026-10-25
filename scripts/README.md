# Scripts

| Script | Purpose |
|---|---|
| `setup.ps1` / `setup.sh` | Install the local Python validation/pipeline environment and frontend dependencies; `--notebooks` creates the notebook environment. |
| `dev.ps1` / `dev.sh` | Start the Vite development server. |
| `precompute.ps1` / `precompute.sh` | Rebuild canonical scenario certificates intentionally. |
| `run_notebooks.py` | Execute the bilingual research notebooks; `--check` executes copies in a temporary directory. |
| `validate_artifacts.py` | Validate scenario/certificate schemas, manifests, values and hashes. |
| `check_frontend_adr.py` | Check shell navigation, required views, responsive instrument structure and shell-token use. |
| `check_sdd.py` | Verify that each live design requirement names an existing gate. |
| `check_skeleton.py` | Reject contract rows that still rely on a stub or other temporary provider. |
| `check_web_baseline.py` | Enforce shell-owned styles, UI tokens, locale-safe figures and pinned shell assets. |
| `check_template_residue.py` | Detect inherited template examples in product content. |
| `check_live.py` | Verify a deployed Pages build against its commit and routes. |

The root `npm run ci` command runs the local product gates. The GitHub Actions workflow runs its bounded release subset.
