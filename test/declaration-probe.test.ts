import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'

describe('declaration probe', () => {
	it('re-exporting a service(...) result emits declarations without TS4023/TS2742', () => {
		const outDir = mkdtempSync(join(tmpdir(), 'effectful-better-auth-dts-'))
		let output = ''
		let failed = false
		try {
			output = execFileSync(
				join('node_modules', '.bin', 'tsc'),
				[
					'-p',
					join('test', 'declaration-probe', 'tsconfig.json'),
					'--outDir',
					outDir
				],
				{ encoding: 'utf8' }
			)
		} catch (error) {
			failed = true
			output = ''
			if (typeof error === 'object' && error !== null && 'stdout' in error) {
				output = String(error.stdout)
			}
			if (typeof error === 'object' && error !== null && 'stderr' in error) {
				output += String(error.stderr)
			}
		}
		expect(output).not.toMatch(/TS4023|TS2742/)
		expect(failed, `tsc failed:\n${output}`).toBe(false)
	}, 120_000)
})
