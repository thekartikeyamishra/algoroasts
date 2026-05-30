<#
  scaffold.ps1 — Algoroasts project structure generator (Windows / PowerShell)
  ---------------------------------------------------------------------------
  Creates the complete folder + empty-file tree for the Algoroasts platform.
  Use this only if you want to build from scratch following MASTER_CONTEXT.md.
  If you received the full zip, you do NOT need this — just run `npm install`.

  USAGE (from the folder where you want the project created):
      powershell -ExecutionPolicy Bypass -File .\scaffold.ps1
  or simply:
      .\scaffold.ps1
#>

$ErrorActionPreference = 'Stop'
$root = 'algoroasts'

Write-Host "Scaffolding '$root' ..." -ForegroundColor Cyan

# --- Directories ---
$dirs = @(
  "$root/app/blog/[slug]",
  "$root/app/category/[slug]",
  "$root/app/about",
  "$root/app/roadmaps",
  "$root/app/api/track",
  "$root/components/layout",
  "$root/components/ads",
  "$root/components/article",
  "$root/components/hook",
  "$root/components/ui",
  "$root/lib",
  "$root/content/posts",
  "$root/public/og"
)
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Force -Path $d | Out-Null
}

# --- Files (created empty; fill from MASTER_CONTEXT.md / the delivered codebase) ---
$files = @(
  # Root config
  "$root/package.json",
  "$root/next.config.mjs",
  "$root/tsconfig.json",
  "$root/tailwind.config.ts",
  "$root/postcss.config.mjs",
  "$root/.eslintrc.json",
  "$root/.gitignore",
  "$root/.env.example",
  "$root/README.md",
  "$root/MASTER_CONTEXT.md",
  # App
  "$root/app/layout.tsx",
  "$root/app/page.tsx",
  "$root/app/globals.css",
  "$root/app/sitemap.ts",
  "$root/app/robots.ts",
  "$root/app/manifest.ts",
  "$root/app/blog/page.tsx",
  "$root/app/blog/[slug]/page.tsx",
  "$root/app/category/[slug]/page.tsx",
  "$root/app/about/page.tsx",
  "$root/app/roadmaps/page.tsx",
  # Components
  "$root/components/JsonLd.tsx",
  "$root/components/layout/Navbar.tsx",
  "$root/components/layout/Footer.tsx",
  "$root/components/ads/AdUnit.tsx",
  "$root/components/ads/AdSlots.tsx",
  "$root/components/ads/slots.ts",
  "$root/components/article/AnswerBlock.tsx",
  "$root/components/article/MdxComponents.tsx",
  "$root/components/hook/HookProvider.tsx",
  "$root/components/hook/HookActions.tsx",
  # Lib
  "$root/lib/site.ts",
  "$root/lib/seo.ts",
  "$root/lib/schema.ts",
  "$root/lib/content.ts",
  "$root/lib/utils.ts",
  # Content + public
  "$root/content/posts/ai-engineer-salary-2026.mdx",
  "$root/content/posts/junior-developer-gap-2026.mdx",
  "$root/public/ads.txt"
)
foreach ($f in $files) {
  if (-not (Test-Path $f)) { New-Item -ItemType File -Force -Path $f | Out-Null }
}

Write-Host "Done. Created $($dirs.Count) folders and $($files.Count) files." -ForegroundColor Green
Write-Host "Next: open MASTER_CONTEXT.md, then fill each file, then run 'npm install'." -ForegroundColor Yellow
