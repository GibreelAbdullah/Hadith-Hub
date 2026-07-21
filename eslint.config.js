import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	{
		files: ['**/*.{ts,js,mjs,cjs}'],
		ignores: ['**/*.svelte.ts'],
		plugins: {
			'@typescript-eslint': ts
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			...ts.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-unused-vars': 'off',
			'no-empty': ['error', { allowEmptyCatch: true }]
		}
	},
	{
		files: ['**/*.svelte.ts'],
		plugins: {
			'@typescript-eslint': ts
		},
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2020
			},
			globals: {
				...globals.browser,
				$state: 'readonly',
				$derived: 'readonly',
				$effect: 'readonly',
				$props: 'readonly',
				$bindable: 'readonly',
				$inspect: 'readonly'
			}
		},
		rules: {
			...ts.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-unused-vars': 'off',
			'no-empty': ['error', { allowEmptyCatch: true }]
		}
	},
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		plugins: {
			'@typescript-eslint': ts
		},
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			},
			globals: {
				...globals.browser
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'no-unused-vars': 'off',
			'no-empty': ['error', { allowEmptyCatch: true }],
			'svelte/no-at-html-tags': 'warn'
		}
	},
	prettier,
	...svelte.configs['flat/prettier'],
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'node_modules/**',
			'package/**',
			'static/pagefind/**',
			'*.cjs'
		]
	}
];
