<script lang="ts">
  import type { EntryConfig } from './model';
  import { ds2hrd, hrd2ds } from './util';

  export let config: EntryConfig;
  let human_duration = ds2hrd(config.duration);
  function update_duration() {
    const d = hrd2ds(human_duration);
    if (Math.floor(d) != d) return;
    config.duration = d;
  }

  const input_style = 'block text-gray-900 bg-gray-50 focus:ring-blue-500';
</script>


<div class="grid grid-cols-3 w-full items-center px-2">
  <label for="name_input">display name</label>
  <input id="name_input" bind:value={config.name} class="{input_style} col-span-2" />

  <label for="repeat_checkbox">repeat</label>
  <input id="repeat_checkbox" type="checkbox" bind:checked={config.repeat} class='col-span-2' />

  <!-- <label for="duration_input">duration(s)</label>
  <input id="duration_input" type="number" bind:value={config.duration} min=1 class="{input_style}" /> -->

  <label for="duration_input">duration</label>
  <input id="duration_input" bind:value={human_duration} on:input={update_duration} class="{input_style} col-span-2" />
</div>