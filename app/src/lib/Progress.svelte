<script lang="ts">
  export let percentage: number = 0.0;
  
  // default to size 32
  // const size: number = 64;
  const size: number = 32;
  const radius: number = size / 2 - 4 - 2; // size / 2 - padding - stroke-width
</script>

<div class="w-8 h-8 -rotate-90 items-center">
  <svg class="w-full h-full">
    <circle
      class="text-gray-500"
      stroke-width="2"
      stroke="currentColor"
      fill="transparent"
      r="{radius}"
      cx="{size / 2}"
      cy="{size / 2}"
    />
    <circle
      class="text-blue-600"
      stroke-width="3"
      stroke-linecap="inherit"
      stroke="currentColor"
      stroke-dasharray="100"
      stroke-dashoffset="{(1 - percentage) * 100}"
      pathLength="100"
      fill="transparent"
      r="{radius}"
      cx="{size / 2}"
      cy="{size / 2}"
    />
  </svg>
</div>
