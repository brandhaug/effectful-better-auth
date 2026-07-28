import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The mount must run on Cloudflare Workers unchanged (SPEC §4): no file in
 * src/ may import a node builtin. Kept dumb and strict on purpose.
 */
describe('workers safety', () => {
  it('no file in src/ imports node:*', () => {
    const srcDir = join(import.meta.dirname, '..', 'src')
    for (const file of readdirSync(srcDir)) {
      const content = readFileSync(join(srcDir, file), 'utf8')
      expect(content, `${file} imports a node builtin`).not.toMatch(
        /from\s+['"]node:|require\(['"]node:|import\(['"]node:/
      )
    }
  })
})
