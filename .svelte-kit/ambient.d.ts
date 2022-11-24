// this file is generated — do not edit it

/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
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
declare module "$env/static/private" {
  export const npm_package_devDependencies__brainandbones_skeleton: string;
  export const MAIL: string;
  export const USER: string;
  export const npm_config_version_commit_hooks: string;
  export const npm_config_user_agent: string;
  export const XDG_SEAT: string;
  export const STARSHIP_SHELL: string;
  export const npm_config_bin_links: string;
  export const XDG_SESSION_TYPE: string;
  export const npm_node_execpath: string;
  export const npm_package_devDependencies_vite: string;
  export const npm_config_init_version: string;
  export const BROWSER: string;
  export const SHLVL: string;
  export const HOME: string;
  export const MOTD_SHOWN: string;
  export const OLDPWD: string;
  export const TERMINFO: string;
  export const npm_package_devDependencies__typescript_eslint_parser: string;
  export const DESKTOP_SESSION: string;
  export const KITTY_INSTALLATION_DIR: string;
  export const npm_package_devDependencies_eslint_config_prettier: string;
  export const COREPACK_ROOT: string;
  export const npm_package_devDependencies_svelte_preprocess: string;
  export const npm_config_init_license: string;
  export const XDG_SEAT_PATH: string;
  export const GTK_MODULES: string;
  export const YARN_WRAP_OUTPUT: string;
  export const npm_package_devDependencies_svelte_check: string;
  export const npm_config_version_tag_prefix: string;
  export const KITTY_PID: string;
  export const npm_package_devDependencies__fontsource_fira_mono: string;
  export const npm_package_scripts_check: string;
  export const DBUS_SESSION_BUS_ADDRESS: string;
  export const COLORTERM: string;
  export const npm_package_description: string;
  export const npm_package_devDependencies_typescript: string;
  export const npm_package_devDependencies_tailwindcss: string;
  export const npm_package_readmeFilename: string;
  export const npm_package_devDependencies_prettier: string;
  export const npm_package_devDependencies__playwright_test: string;
  export const npm_package_scripts_dev: string;
  export const LOGNAME: string;
  export const npm_package_type: string;
  export const _: string;
  export const WINDOWID: string;
  export const npm_package_devDependencies_autoprefixer: string;
  export const npm_package_devDependencies__sveltejs_adapter_node: string;
  export const npm_package_scripts_check_watch: string;
  export const XDG_SESSION_CLASS: string;
  export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
  export const npm_package_devDependencies__types_cookie: string;
  export const npm_package_scripts_lint: string;
  export const npm_config_registry: string;
  export const TERM: string;
  export const XDG_SESSION_ID: string;
  export const KITTY_PUBLIC_KEY: string;
  export const DOTNET_ROOT: string;
  export const npm_package_devDependencies_eslint_plugin_svelte3: string;
  export const npm_config_ignore_scripts: string;
  export const PATH: string;
  export const NODE: string;
  export const npm_package_name: string;
  export const XDG_SESSION_PATH: string;
  export const XDG_RUNTIME_DIR: string;
  export const DISPLAY: string;
  export const npm_package_devDependencies_postcss_load_config: string;
  export const LANG: string;
  export const DOTNET_BUNDLE_EXTRACT_BASE_DIR: string;
  export const npm_package_devDependencies_eslint: string;
  export const XDG_SESSION_DESKTOP: string;
  export const XAUTHORITY: string;
  export const npm_lifecycle_script: string;
  export const XDG_GREETER_DATA_DIR: string;
  export const npm_package_devDependencies__sveltejs_kit: string;
  export const npm_package_scripts_test: string;
  export const npm_config_version_git_message: string;
  export const SHELL: string;
  export const npm_lifecycle_event: string;
  export const npm_package_version: string;
  export const GDMSESSION: string;
  export const npm_config_argv: string;
  export const npm_package_devDependencies_tslib: string;
  export const npm_package_devDependencies_svelte: string;
  export const npm_package_scripts_build: string;
  export const KITTY_WINDOW_ID: string;
  export const npm_config_version_git_tag: string;
  export const npm_config_version_git_sign: string;
  export const npm_config_strict_ssl: string;
  export const XDG_VTNR: string;
  export const npm_package_scripts_format: string;
  export const PWD: string;
  export const npm_execpath: string;
  export const KEYTIMEOUT: string;
  export const STARSHIP_SESSION_KEY: string;
  export const npm_package_devDependencies_postcss: string;
  export const npm_package_devDependencies__sveltejs_adapter_auto: string;
  export const npm_package_devDependencies__neoconfetti_svelte: string;
  export const npm_config_save_prefix: string;
  export const npm_config_ignore_optional: string;
  export const npm_package_devDependencies_prettier_plugin_svelte: string;
  export const npm_package_scripts_preview: string;
  export const TERMINAL: string;
  export const PNPM_HOME: string;
  export const INIT_CWD: string;
  export const EDITOR: string;
  export const NODE_ENV: string;
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
declare module "$env/static/public" {}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 *
 * This module cannot be imported into client-side code.
 *
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 *
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module "$env/dynamic/private" {
  export const env: {
    npm_package_devDependencies__brainandbones_skeleton: string;
    MAIL: string;
    USER: string;
    npm_config_version_commit_hooks: string;
    npm_config_user_agent: string;
    XDG_SEAT: string;
    STARSHIP_SHELL: string;
    npm_config_bin_links: string;
    XDG_SESSION_TYPE: string;
    npm_node_execpath: string;
    npm_package_devDependencies_vite: string;
    npm_config_init_version: string;
    BROWSER: string;
    SHLVL: string;
    HOME: string;
    MOTD_SHOWN: string;
    OLDPWD: string;
    TERMINFO: string;
    npm_package_devDependencies__typescript_eslint_parser: string;
    DESKTOP_SESSION: string;
    KITTY_INSTALLATION_DIR: string;
    npm_package_devDependencies_eslint_config_prettier: string;
    COREPACK_ROOT: string;
    npm_package_devDependencies_svelte_preprocess: string;
    npm_config_init_license: string;
    XDG_SEAT_PATH: string;
    GTK_MODULES: string;
    YARN_WRAP_OUTPUT: string;
    npm_package_devDependencies_svelte_check: string;
    npm_config_version_tag_prefix: string;
    KITTY_PID: string;
    npm_package_devDependencies__fontsource_fira_mono: string;
    npm_package_scripts_check: string;
    DBUS_SESSION_BUS_ADDRESS: string;
    COLORTERM: string;
    npm_package_description: string;
    npm_package_devDependencies_typescript: string;
    npm_package_devDependencies_tailwindcss: string;
    npm_package_readmeFilename: string;
    npm_package_devDependencies_prettier: string;
    npm_package_devDependencies__playwright_test: string;
    npm_package_scripts_dev: string;
    LOGNAME: string;
    npm_package_type: string;
    _: string;
    WINDOWID: string;
    npm_package_devDependencies_autoprefixer: string;
    npm_package_devDependencies__sveltejs_adapter_node: string;
    npm_package_scripts_check_watch: string;
    XDG_SESSION_CLASS: string;
    npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
    npm_package_devDependencies__types_cookie: string;
    npm_package_scripts_lint: string;
    npm_config_registry: string;
    TERM: string;
    XDG_SESSION_ID: string;
    KITTY_PUBLIC_KEY: string;
    DOTNET_ROOT: string;
    npm_package_devDependencies_eslint_plugin_svelte3: string;
    npm_config_ignore_scripts: string;
    PATH: string;
    NODE: string;
    npm_package_name: string;
    XDG_SESSION_PATH: string;
    XDG_RUNTIME_DIR: string;
    DISPLAY: string;
    npm_package_devDependencies_postcss_load_config: string;
    LANG: string;
    DOTNET_BUNDLE_EXTRACT_BASE_DIR: string;
    npm_package_devDependencies_eslint: string;
    XDG_SESSION_DESKTOP: string;
    XAUTHORITY: string;
    npm_lifecycle_script: string;
    XDG_GREETER_DATA_DIR: string;
    npm_package_devDependencies__sveltejs_kit: string;
    npm_package_scripts_test: string;
    npm_config_version_git_message: string;
    SHELL: string;
    npm_lifecycle_event: string;
    npm_package_version: string;
    GDMSESSION: string;
    npm_config_argv: string;
    npm_package_devDependencies_tslib: string;
    npm_package_devDependencies_svelte: string;
    npm_package_scripts_build: string;
    KITTY_WINDOW_ID: string;
    npm_config_version_git_tag: string;
    npm_config_version_git_sign: string;
    npm_config_strict_ssl: string;
    XDG_VTNR: string;
    npm_package_scripts_format: string;
    PWD: string;
    npm_execpath: string;
    KEYTIMEOUT: string;
    STARSHIP_SESSION_KEY: string;
    npm_package_devDependencies_postcss: string;
    npm_package_devDependencies__sveltejs_adapter_auto: string;
    npm_package_devDependencies__neoconfetti_svelte: string;
    npm_config_save_prefix: string;
    npm_config_ignore_optional: string;
    npm_package_devDependencies_prettier_plugin_svelte: string;
    npm_package_scripts_preview: string;
    TERMINAL: string;
    PNPM_HOME: string;
    INIT_CWD: string;
    EDITOR: string;
    NODE_ENV: string;
    [key: `PUBLIC_${string}`]: undefined;
    [key: string]: string | undefined;
  };
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
declare module "$env/dynamic/public" {
  export const env: {
    [key: `PUBLIC_${string}`]: string | undefined;
  };
}
