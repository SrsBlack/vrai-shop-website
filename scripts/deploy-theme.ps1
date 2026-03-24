[CmdletBinding()]
param(
    [Parameter(HelpMessage = "Pushes to live theme when specified. Without this flag, push goes to staging theme.")]
    [switch]$Live,

    [Parameter(HelpMessage = "Optional list of file paths to deploy. Example: -Only templates/product.json,sections/product-redesign.liquid")]
    [string[]]$Only,

    [Parameter(HelpMessage = "Skips git cleanliness warning.")]
    [switch]$AllowDirty,

    [Parameter(HelpMessage = "Skips interactive confirmation for live deployment.")]
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Assert-CommandExists {
    param([string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' is not installed or not in PATH."
    }
}

function Get-CurrentBranch {
    $branch = git rev-parse --abbrev-ref HEAD 2>$null
    return ($branch | Out-String).Trim()
}

function Get-GitStatusShort {
    $status = git status --short 2>$null
    return ($status | Out-String).Trim()
}

Assert-CommandExists -Name 'shopify'
Assert-CommandExists -Name 'git'

$storeDomain = $env:SHOPIFY_STORE_DOMAIN
$stagingThemeId = $env:SHOPIFY_THEME_STAGING_ID
$liveThemeId = $env:SHOPIFY_THEME_LIVE_ID

if ([string]::IsNullOrWhiteSpace($storeDomain)) {
    throw "Environment variable SHOPIFY_STORE_DOMAIN is required. Example: vraicanada.myshopify.com"
}

if ([string]::IsNullOrWhiteSpace($stagingThemeId)) {
    throw "Environment variable SHOPIFY_THEME_STAGING_ID is required."
}

if ([string]::IsNullOrWhiteSpace($liveThemeId)) {
    throw "Environment variable SHOPIFY_THEME_LIVE_ID is required."
}

$currentBranch = Get-CurrentBranch
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    throw "Could not detect current git branch."
}

$dirtyState = Get-GitStatusShort
if (-not $AllowDirty -and -not [string]::IsNullOrWhiteSpace($dirtyState)) {
    Write-Warning "Working tree is not clean. Commit or stash changes before deploying, or re-run with -AllowDirty."
    Write-Host "\nDetected changes:" -ForegroundColor Yellow
    Write-Host $dirtyState
    throw "Aborting deployment due to dirty git state."
}

if ($Live -and $currentBranch -ne 'main' -and $currentBranch -ne 'master') {
    throw "Live deployment is only allowed from main/master. Current branch: $currentBranch"
}

$targetThemeId = if ($Live) { $liveThemeId } else { $stagingThemeId }
$targetLabel = if ($Live) { 'LIVE' } else { 'STAGING' }
$storeHandle = ($storeDomain -split '\\.')[0]
$themeEditorUrl = "https://admin.shopify.com/store/$storeHandle/themes/$targetThemeId/editor"

Write-Host "\n=== Shopify Deployment Checklist ===" -ForegroundColor Cyan
Write-Host "Target: $targetLabel"
Write-Host "Store : $storeDomain"
Write-Host "Theme : $targetThemeId"
Write-Host "Branch: $currentBranch"
Write-Host "Editor: $themeEditorUrl"

if ($Live -and -not $Force) {
    $confirmation = Read-Host "Type DEPLOY LIVE to continue"
    if ($confirmation -ne 'DEPLOY LIVE') {
        throw "Live deployment cancelled by user."
    }
}

$args = @(
    'theme', 'push',
    '--store', $storeDomain,
    '--theme', $targetThemeId,
    '--allow-live'
)

foreach ($filePath in $Only) {
    $args += @('--only', $filePath)
}

Write-Host "\nRunning: shopify $($args -join ' ')" -ForegroundColor DarkGray
& shopify @args

if ($LASTEXITCODE -ne 0) {
    throw "Shopify deployment failed with exit code $LASTEXITCODE"
}

Write-Host "\nDeployment complete." -ForegroundColor Green
Write-Host "Preview/edit theme: $themeEditorUrl"

if (-not $Live) {
    Write-Host "\nNext: validate staging theme in Shopify preview, then run this script again with -Live." -ForegroundColor Cyan
}
