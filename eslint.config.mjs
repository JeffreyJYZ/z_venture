import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
	]),
	{
		plugins: ["unused-imports"],
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"css(unknownAtRules)": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"prefer-const": "off",
			"@typescript-eslint/no-unnecessary-type-constraint": "off",
			"@typescript-eslint/no-require-imports": "off",
			"@typescript-eslint/no-unused-imports": "warn",
			"unused-imports/no-unused-imports": "warn",
			"unused-imports/no-unused-vars": "off",
		},
	},
]);

export default eslintConfig;
