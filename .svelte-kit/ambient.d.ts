
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into public-facing code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const BAMF_DESKTOP_FILE_HINT: string;
	export const CHROME_DESKTOP: string;
	export const COLOR: string;
	export const COLORTERM: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const DESKTOP_SESSION: string;
	export const DISPLAY: string;
	export const EDITOR: string;
	export const GDK_BACKEND: string;
	export const GDMSESSION: string;
	export const GIO_LAUNCHED_DESKTOP_FILE: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const GIT_ASKPASS: string;
	export const GJS_DEBUG_OUTPUT: string;
	export const GJS_DEBUG_TOPICS: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GPG_AGENT_INFO: string;
	export const GSETTINGS_SCHEMA_DIR: string;
	export const GTK_MODULES: string;
	export const HOME: string;
	export const IM_CONFIG_PHASE: string;
	export const INIT_CWD: string;
	export const INVOCATION_ID: string;
	export const JOURNAL_STREAM: string;
	export const LANG: string;
	export const LANGUAGE: string;
	export const LESSCLOSE: string;
	export const LESSOPEN: string;
	export const LOGNAME: string;
	export const LS_COLORS: string;
	export const MANAGERPID: string;
	export const NODE: string;
	export const OLDPWD: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const PATH: string;
	export const PWD: string;
	export const QT_ACCESSIBILITY: string;
	export const QT_IM_MODULE: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const QT_STYLE_OVERRIDE: string;
	export const SESSION_MANAGER: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SNAP: string;
	export const SNAP_ARCH: string;
	export const SNAP_COMMON: string;
	export const SNAP_CONTEXT: string;
	export const SNAP_COOKIE: string;
	export const SNAP_DATA: string;
	export const SNAP_INSTANCE_KEY: string;
	export const SNAP_INSTANCE_NAME: string;
	export const SNAP_LIBRARY_PATH: string;
	export const SNAP_NAME: string;
	export const SNAP_REAL_HOME: string;
	export const SNAP_REEXEC: string;
	export const SNAP_REVISION: string;
	export const SNAP_USER_COMMON: string;
	export const SNAP_USER_DATA: string;
	export const SNAP_VERSION: string;
	export const SSH_AGENT_PID: string;
	export const SSH_AUTH_SOCK: string;
	export const TERM: string;
	export const TERM_PROGRAM: string;
	export const TERM_PROGRAM_VERSION: string;
	export const USER: string;
	export const USERNAME: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const WINDOWPATH: string;
	export const XAUTHORITY: string;
	export const XDG_CONFIG_DIRS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const XDG_DATA_DIRS: string;
	export const XDG_MENU_PREFIX: string;
	export const XDG_RUNTIME_DIR: string;
	export const XDG_SESSION_CLASS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XDG_SESSION_TYPE: string;
	export const XMODIFIERS: string;
	export const _: string;
	export const npm_command: string;
	export const npm_config_cache: string;
	export const npm_config_global_prefix: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const npm_config_local_prefix: string;
	export const npm_config_metrics_registry: string;
	export const npm_config_node_gyp: string;
	export const npm_config_noproxy: string;
	export const npm_config_prefix: string;
	export const npm_config_user_agent: string;
	export const npm_config_userconfig: string;
	export const npm_execpath: string;
	export const npm_lifecycle_event: string;
	export const npm_lifecycle_script: string;
	export const npm_node_execpath: string;
	export const npm_package_json: string;
	export const npm_package_name: string;
	export const npm_package_version: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {

}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * This module cannot be imported into public-facing code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		BAMF_DESKTOP_FILE_HINT: string;
		CHROME_DESKTOP: string;
		COLOR: string;
		COLORTERM: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		DESKTOP_SESSION: string;
		DISPLAY: string;
		EDITOR: string;
		GDK_BACKEND: string;
		GDMSESSION: string;
		GIO_LAUNCHED_DESKTOP_FILE: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		GIT_ASKPASS: string;
		GJS_DEBUG_OUTPUT: string;
		GJS_DEBUG_TOPICS: string;
		GNOME_DESKTOP_SESSION_ID: string;
		GNOME_SHELL_SESSION_MODE: string;
		GPG_AGENT_INFO: string;
		GSETTINGS_SCHEMA_DIR: string;
		GTK_MODULES: string;
		HOME: string;
		IM_CONFIG_PHASE: string;
		INIT_CWD: string;
		INVOCATION_ID: string;
		JOURNAL_STREAM: string;
		LANG: string;
		LANGUAGE: string;
		LESSCLOSE: string;
		LESSOPEN: string;
		LOGNAME: string;
		LS_COLORS: string;
		MANAGERPID: string;
		NODE: string;
		OLDPWD: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		PATH: string;
		PWD: string;
		QT_ACCESSIBILITY: string;
		QT_IM_MODULE: string;
		QT_QPA_PLATFORMTHEME: string;
		QT_STYLE_OVERRIDE: string;
		SESSION_MANAGER: string;
		SHELL: string;
		SHLVL: string;
		SNAP: string;
		SNAP_ARCH: string;
		SNAP_COMMON: string;
		SNAP_CONTEXT: string;
		SNAP_COOKIE: string;
		SNAP_DATA: string;
		SNAP_INSTANCE_KEY: string;
		SNAP_INSTANCE_NAME: string;
		SNAP_LIBRARY_PATH: string;
		SNAP_NAME: string;
		SNAP_REAL_HOME: string;
		SNAP_REEXEC: string;
		SNAP_REVISION: string;
		SNAP_USER_COMMON: string;
		SNAP_USER_DATA: string;
		SNAP_VERSION: string;
		SSH_AGENT_PID: string;
		SSH_AUTH_SOCK: string;
		TERM: string;
		TERM_PROGRAM: string;
		TERM_PROGRAM_VERSION: string;
		USER: string;
		USERNAME: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		WINDOWPATH: string;
		XAUTHORITY: string;
		XDG_CONFIG_DIRS: string;
		XDG_CURRENT_DESKTOP: string;
		XDG_DATA_DIRS: string;
		XDG_MENU_PREFIX: string;
		XDG_RUNTIME_DIR: string;
		XDG_SESSION_CLASS: string;
		XDG_SESSION_DESKTOP: string;
		XDG_SESSION_TYPE: string;
		XMODIFIERS: string;
		_: string;
		npm_command: string;
		npm_config_cache: string;
		npm_config_global_prefix: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		npm_config_local_prefix: string;
		npm_config_metrics_registry: string;
		npm_config_node_gyp: string;
		npm_config_noproxy: string;
		npm_config_prefix: string;
		npm_config_user_agent: string;
		npm_config_userconfig: string;
		npm_execpath: string;
		npm_lifecycle_event: string;
		npm_lifecycle_script: string;
		npm_node_execpath: string;
		npm_package_json: string;
		npm_package_name: string;
		npm_package_version: string;
		[key: string]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: string]: string | undefined;
	}
}
