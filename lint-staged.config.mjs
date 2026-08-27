// Function form: generated .d.ts probes under prototype-typing/ are excluded
// from both tasks. oxfmt and oxlint error when every file they are passed is
// ignored, so a generated-file-only commit would otherwise brick pre-commit.
const isGeneratedProbe = (file) => file.startsWith('prototype-typing/')

export default {
	'*.{ts,tsx,js,jsx,json,yml,yaml}': (files) => {
		if (files.every(isGeneratedProbe)) return []
		return ['oxfmt --write']
	},
	'*.{ts,tsx,js,jsx}': (files) => {
		if (files.every(isGeneratedProbe)) return []
		return ['oxlint --type-aware --fix']
	}
}
