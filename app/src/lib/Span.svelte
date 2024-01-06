<script lang="ts">
  import * as Neutralino from '@neutralinojs/lib';
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { setInterval, clearInterval } from 'worker-timers';
  import type { EntryConfig } from "./model";
  import SpanControl from "./SpanControl.svelte";
  import SpanConfig from "./SpanConfig.svelte";
  import { SpanState } from "./span";
  import Progress from "./Progress.svelte";

  const dispatch = createEventDispatcher();

  const sendNotification = async ({title, content}) => {
    console.log('send notification,', title, content);
    // await Neutralino.os.showNotification(title, content, Neutralino.os.Icon.INFO);
    await Neutralino.os.spawnProcess(`/usr/bin/notify-send -a nomo -t 0 -i clock -u critical "${title}" "${content}"`);
  };

  export let entry: EntryConfig;
  
  interface State {
    expanded: boolean,
    ctrl: SpanState,
    timer: number | null,
    elapsed: number,
  }

  const state: State = {
    expanded: false,
    ctrl: SpanState.stopped,
    timer: null,
    elapsed: 0,
  };

  $: on_ctrl(state.ctrl);

  onMount(() => {
  });
  onDestroy(() => {
    state.ctrl = SpanState.stopped;
  });

  function on_ctrl(ctrl: SpanState) {
    if (ctrl != SpanState.stopped) {
      state.expanded = false;
    }
    // play/pause/stop/restart
    switch (ctrl) {
      case SpanState.running:
        if (!state.timer) {
          state.timer = setInterval(on_timer, 1000);
        }
        break;
      case SpanState.paused:
        if (state.timer) {
          clearInterval(state.timer);
          state.timer = null;
        }
        break;
      case SpanState.stopped:
        if (state.timer) {
          clearInterval(state.timer);
          state.timer = null;
        }
        state.elapsed = 0;
        break;
      default:
        // should not enter
        break;
    }
  }
  function on_timer() {
    state.elapsed += 1;
    if (state.elapsed == entry.duration) {
      state.elapsed = 0;
      if (!entry.repeat) {
        if (state.timer)
          clearInterval(state.timer);
        state.timer = null;
        state.ctrl = SpanState.stopped;
      }

      on_finished();
    }
  }
  function on_finished() {
    sendNotification({
      title: entry.name,
      content: `${entry.name} ended`,
    }).finally(() => {});
    dispatch('trigger');
  }
  function on_restart() {
    if (state.timer) {
      clearInterval(state.timer);
    }
    state.elapsed = 0;
    state.ctrl = SpanState.running;
    state.timer = setInterval(on_timer, 1000);
  }

  function toggle_expanded() {
    state.expanded = !state.expanded;
  }
  function on_double_click() {
    switch (state.ctrl) {
      case SpanState.paused:
      case SpanState.stopped:
        state.ctrl = SpanState.running;
        break;
      case SpanState.running:
        state.ctrl = SpanState.paused;
        break;
      default:
        break;
    }
  }
</script>

<div
  class="flex flex-col w-full {state.expanded
    ? 'h-32'
    : 'h-8'} justify-start transition-all duration-100 text-slate-100"
>
  <div
    class="flex w-full h-8 items-center hover:border-l-4 hover:!border-indigo-400 hover:bg-green-700 bg-green-800"
  >
    <div class="flex-none px-0">
      {#if state.ctrl == SpanState.stopped}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg
          id="forward.svg"
          viewBox="0 0 24 24"
          class="w-8 h-full scale-50 fill-white {state.expanded
            ? 'rotate-90'
            : 'rotate-0'} transition duration-150"
          on:click={toggle_expanded}
        >
          <path d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2l10 10l-10 10Z" />
        </svg>
      {:else}
        <Progress percentage={state.elapsed / entry.duration} />
      {/if}
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="grow flex items-center px-1 text-xl truncate" on:dblclick={on_double_click}>
      {entry.name}
    </div>
    <div class="flex-none flex items-center px-1">
      <SpanControl bind:ctrl={state.ctrl} on:restart={on_restart} />
    </div>
  </div>
  <div class="flex w-full overflow-hidden {state.expanded ? 'h-24' : 'h-0'}">
    <SpanConfig bind:config={entry} />
  </div>
</div>

<style lang="postcss">
</style>
