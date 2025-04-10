import fs from 'node:fs'
import path from 'node:path'
import type { AstroIntegration } from 'astro'

/**
 * ドメインに対応したpublicファイルをdistにコピーする
 * @param currentPath ドメイン名（初回）、またはドメイン名+パス（再帰時）
 */
const copyPublicSiteFiles = (currentPath: string) => {
  const srcDir = path.join('public_sites', currentPath)
  const destDir = 'dist'

  if (fs.existsSync(srcDir)) {
    const entries = fs.readdirSync(srcDir, { withFileTypes: true })

    // distフォルダはあるはずだが一応チェック
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // 対象ドメインディレクトリのファイルをコピー
    for (const entry of entries) {
      const srcPath = path.join(srcDir, entry.name)
      const destPath = path.join(destDir, entry.name)

      if (entry.isDirectory()) {
        copyPublicSiteFiles(path.join(currentPath, entry.name))
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }
    console.log(`Finished copying files for ${currentPath} to dist!`)
  } else {
    console.warn(`Source directory ${srcDir} does not exist.`)
  }
}

export default (): AstroIntegration => ({
  name: 'site-settings-copier',
  hooks: {
    'astro:build:done': async () => {
      const publicSite = process.env.CUSTOM_DOMAIN
      console.log('[site-settings-copier] copy site settings files')
      if (publicSite) {
        console.log(
          `[site-settings-copier] 'public_sites/${publicSite}/*' -> 'dist/*'`
        )
        copyPublicSiteFiles(publicSite)
      } else {
        console.warn('CUSTOM_DOMAIN environment variable is not set.')
      }
    },
  },
})
