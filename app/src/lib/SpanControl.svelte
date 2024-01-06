<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import { SpanState } from "./span";

  export let ctrl: SpanState;

  function play_pause() {
    if (ctrl == SpanState.stopped || ctrl == SpanState.paused) {
      ctrl = SpanState.running;
    } else {
      ctrl = SpanState.paused;
    }
  }
  export function stop() {
    ctrl = SpanState.stopped;
  }
  function sig_restart() {
    dispatch("restart");
  }
</script>

<div class="flex flex-row items-center">
  <div class="p-0 cursor-pointer" on:click={play_pause}>
    <svg
      id="play_pause.svg"
      viewBox="0 0 24 24"
      class="svg-ctrl"
    >
      {#if ctrl == SpanState.running}
        <path d="M13 19V5h6v14h-6Zm-8 0V5h6v14H5Zm10-2h2V7h-2v10Zm-8 0h2V7H7v10Z"/>
      {:else}
        <path d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"/>
      {/if}
    </svg>
  </div>
  {#if ctrl != SpanState.stopped}
    <div class="p-0 cursor-pointer" on:click={stop}>
      <svg
        id="stop.svg"
        viewBox="0 0 24 24"
        class="svg-ctrl"
      >
        <path d="M8 8v8v-8ZM6 18V6h12v12H6Zm2-2h8V8H8v8Z" />
      </svg>
    </div>
    <div class="p-0 cursor-pointer" on:click={sig_restart}>
      <svg
        id="restart.svg"
        viewBox="0 0 24 24"
        class="svg-ctrl"
      >
        <path
          d="M11 20.95q-3.025-.375-5.013-2.637T4 13q0-1.65.65-3.163T6.5 7.2l1.425 1.425q-.95.85-1.438 1.975T6 13q0 2.2 1.4 3.888T11 18.95v2Zm2 0v-2q2.175-.4 3.588-2.075T18 13q0-2.5-1.75-4.25T12 7h-.075l1.1 1.1l-1.4 1.4l-3.5-3.5l3.5-3.5l1.4 1.4l-1.1 1.1H12q3.35 0 5.675 2.325T20 13q0 3.025-1.988 5.288T13 20.95Z"
        />
      </svg>
    </div>
  {/if}
</div>

<style lang="postcss">
  .svg-ctrl {
    @apply w-8 h-full fill-white scale-75 hover:scale-90;
  }
</style>
