<script>
  let { label = '?' } = $props();
</script>

<svg class="ph-glyph" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <rect
    x="7"
    y="7"
    width="34"
    height="34"
    rx="5"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-dasharray="4 3"
  />
  <text
    x="24"
    y="30"
    text-anchor="middle"
    font-size="14"
    font-weight="700"
    fill="currentColor"
    font-family="system-ui, sans-serif"
  >{label}</text>
</svg>

<style>
  .ph-glyph {
    width: 64px;
    height: 64px;
    display: block;
  }

  @media (max-width: 760px) {
    .ph-glyph {
      width: 44px;
      height: 44px;
    }
  }
</style>
