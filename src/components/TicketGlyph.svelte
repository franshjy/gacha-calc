<script>
  let { count = 1 } = $props();
</script>

<svg class="ph-ticket" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <path
    d="M6 14h36v6a4 4 0 0 0 0 8v6H6v-6a4 4 0 0 0 0-8z"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-dasharray="4 3"
  />
  <text
    x="24"
    y="29"
    text-anchor="middle"
    font-size={count > 9 ? 11 : 13}
    font-weight="700"
    fill="currentColor"
    font-family="system-ui, sans-serif"
  >×{count}</text>
</svg>

<style>
  .ph-ticket {
    width: 64px;
    height: 64px;
    display: block;
  }

  @media (max-width: 760px) {
    .ph-ticket {
      width: 44px;
      height: 44px;
    }
  }
</style>
