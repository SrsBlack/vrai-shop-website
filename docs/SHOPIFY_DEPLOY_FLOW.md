# Shopify Deploy Flow

This project uses a staging-first workflow.

## 1) Branch Strategy

Use this lightweight git strategy:

- `main`: production-ready branch only
- `feature/<short-name>`: each change or fix
- `hotfix/<short-name>`: urgent live fixes

Rules:

1. Do all normal work in `feature/*`.
2. Open PR into `main`.
3. Merge to `main` only after staging validation.
4. Deploy live only from `main`.

## 2) Environment Variables (One-Time Setup)

Set these in your PowerShell profile or shell session:

```powershell
$env:SHOPIFY_STORE_DOMAIN = "vraicanada.myshopify.com"
$env:SHOPIFY_THEME_STAGING_ID = "REPLACE_WITH_STAGING_THEME_ID"
$env:SHOPIFY_THEME_LIVE_ID = "184459231527"
```

Tip: create a duplicate unpublished theme in Shopify and use that ID for staging.

## 3) Safe Staging Preview Before Live

Default deployment target is staging.

```powershell
.\scripts\deploy-theme.ps1
```

Deploy only changed files to staging:

```powershell
.\scripts\deploy-theme.ps1 -Only templates/product.json,sections/product-redesign.liquid,assets/store-redesign.css
```

After push, open the theme editor/preview link printed by the script and run your QA checks.

## 4) Live Push (Intentional Only)

Live push requires:

- `main` branch
- explicit live flag
- typed confirmation (`DEPLOY LIVE`)

```powershell
.\scripts\deploy-theme.ps1 -Live
```

If you must bypass confirmation in CI:

```powershell
.\scripts\deploy-theme.ps1 -Live -Force
```

## 5) One-Command Deploy Checklist

Run this command every release:

```powershell
.\scripts\deploy-theme.ps1
```

It enforces or surfaces:

1. Shopify CLI installed
2. git installed
3. required environment variables present
4. clean working tree (unless `-AllowDirty`)
5. live deploy branch guard (main/master only)
6. explicit live confirmation
7. deployment target + editor URL output

## 6) Recommended Release Sequence

1. Create branch `feature/<name>`
2. Implement and commit
3. Push to staging with script
4. QA staging preview
5. Merge PR to `main`
6. Run `.\scripts\deploy-theme.ps1 -Live`
7. Smoke test key live routes
