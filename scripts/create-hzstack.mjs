#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

function copyDir(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src)) {
    if (ignore.includes(entry)) continue
    const s = path.join(src, entry)
    const d = path.join(dest, entry)
    const stat = fs.statSync(s)
    if (stat.isDirectory()) {
      copyDir(s, d, ignore)
    } else {
      fs.copyFileSync(s, d)
    }
  }
}

async function main() {
  const target = process.argv[2]
  if (!target) {
    console.error('Usage: create-hzstack <directory>')
    process.exit(1)
  }
  const cwd = process.cwd()
  const templateRoot = path.resolve(__dirname, '..')
  const dest = path.resolve(cwd, target)

  const ignore = [
    'node_modules', '.git', '.next', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock',
    'scripts/create-hzstack.mjs'
  ]

  copyDir(templateRoot, dest, ignore)

  // Reset package name
  const pkgPath = path.join(dest, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.name = target.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
  delete pkg.bin
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

  console.log(`✔ Project created in ${dest}`)
  console.log('Next steps:')
  console.log(`  cd ${target}`)
  console.log('  pnpm i')
  console.log('  pnpm assets:build && pnpm dev')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


