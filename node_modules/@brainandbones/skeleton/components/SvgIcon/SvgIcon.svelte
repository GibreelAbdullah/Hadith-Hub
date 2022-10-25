<script context="module">
	import { icons } from './icons';
</script>

<script>// Props
export let name = 'image';
export let x = '0px';
export let y = '0px';
export let viewBox = icons[name].viewBox || '0 0 512 512';
// Props (Styles)
export let fill = 'fill-token';
export let width = 'w-5';
export let height = 'w-5';
// A11y
export let title = undefined;
// Base Classes
const cBase = 'inline-block outline-none';
// Reactive Classes
$: classesBase = `${cBase} ${fill} ${width} ${height}`;
</script>

<!-- prettier-ignore -->
<svg
    xmlns="http://www.w3.org/2000/svg"
    {x} {y}
    {viewBox}
    class="svg-icon {classesBase} {$$props.class ?? ''}"
    focusable="false"
	data-testid="svg-icon"
>
    {#if title}<title>{title}</title>{/if}
    {#if $$slots.default}
        <slot />
    {:else}
        <path d={icons[name].path} />
    {/if}
</svg>
