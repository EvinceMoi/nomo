<script lang="ts">
	import toast, { Toaster } from "svelte-french-toast";
	import { dndzone } from "svelte-dnd-action";
	import { flip } from "svelte/animate";
	import moment from "moment";
	import { setInterval } from "worker-timers";
	import _ from "lodash";
	import { load_entrys, save_entrys, type EntryConfig } from "./lib/model";
	import { onMount, onDestroy } from "svelte";
	import Span from "./lib/Span.svelte";

	let audio: HTMLAudioElement;

	let entrys: EntryConfig[] = [];
	let old_entrys: EntryConfig[] = [];

	$: has_unsaved_changes = !_.isEqual(entrys, old_entrys);

	let date_time: string;
	let tab: string = "timer";

	onMount(async () => {
		audio = new Audio("/assets/audio/yahaha.mp3");
		audio.preload = "auto";
		// let os = await platform();
		// if (os == 'linux') {
		// audio.play();
		// }

		entrys = await load_entrys();
		old_entrys = _.cloneDeep(entrys);

		let timer = setInterval(on_timer, 250);

		return async () => {
			clearInterval(timer);
			await save_entrys(entrys);
		};
	});
	onDestroy(() => {
		// audio.unload();
	});

	function play_notification_sound() {
		audio.play().catch((e) => {
			console.log(e);
		});
	}

	function on_timer() {
		date_time = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	function add_entry() {
		const entry: EntryConfig = {
			id: String(Math.floor(Date.now())),
			name: "new entry",
			duration: 600,
			repeat: false,
		};
		entrys = [entry, ...entrys];
	}
	function del_entry(id: string) {
		entrys = entrys.filter((it) => it.id != id);
	}

	async function sync_config() {
		await save_entrys(entrys);
		old_entrys = _.cloneDeep(entrys);
		toast.success("config saved", {
			style: "background: #333; color: #fff",
		});
	}

	let edit_mode = false;
	function toggle_edit_mode() {
		edit_mode = !edit_mode;
	}

	function on_dnd_event(e) {
		entrys = e.detail.items;
	}
</script>

<main
	class="flex flex-col justify-start w-full h-screen bg-zinc-900 select-none"
>
	<Toaster />
	<section
		id="header-section"
		class="flex-none flex justify-start h-8 bg-transparent"
	>
		<svg id="add.svg" viewBox="0 0 24 24" class="svg-btn" on:click={add_entry}>
			<path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6h-2Z" />
		</svg>
		<svg
			id="save.svg"
			viewBox="0 0 24 24"
			class="svg-btn-nf {has_unsaved_changes
				? 'fill-yellow-500'
				: 'fill-slate-300'}"
			on:click={sync_config}
		>
			<path
				d="M21 7v12q0 .825-.588 1.413T19 21H5q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h12l4 4Zm-2 .85L16.15 5H5v14h14V7.85ZM12 18q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4ZM5 7.85V19V5v2.85Z"
			/>
		</svg>
		<svg
			id="edit.svg"
			viewBox="0 0 24 24"
			class="svg-btn-nf {edit_mode ? 'fill-green-300' : 'fill-slate-300'}"
			on:click={toggle_edit_mode}
		>
			<path
				d="M12 21v-2.125l5.3-5.3l2.125 2.125l-5.3 5.3H12Zm-9-5v-2h7v2H3Zm17.125-1L18 12.875l.725-.725q.275-.275.7-.275t.7.275l.725.725q.275.275.275.7t-.275.7l-.725.725ZM3 12v-2h11v2H3Zm0-4V6h11v2H3Z"
			/>
		</svg>
		<div class="grow flex justify-end items-center">
			<div class="h-2/3 border-r border-r-slate-500" />
		</div>
		<svg
			id="timer.svg"
			viewBox="0 0 24 24"
			class="svg-tab {tab == 'timer' ? 'fill-green-300' : 'fill-slate-400'}"
			on:click={() => (tab = "timer")}
		>
			<path
				d="M9 3V1h6v2H9Zm2 11h2V8h-2v6Zm1 8q-1.85 0-3.488-.713T5.65 19.35q-1.225-1.225-1.938-2.863T3 13q0-1.85.713-3.488T5.65 6.65q1.225-1.225 2.863-1.938T12 4q1.55 0 2.975.5t2.675 1.45l1.4-1.4l1.4 1.4l-1.4 1.4Q20 8.6 20.5 10.025T21 13q0 1.85-.713 3.488T18.35 19.35q-1.225 1.225-2.863 1.938T12 22Zm0-2q2.9 0 4.95-2.05T19 13q0-2.9-2.05-4.95T12 6Q9.1 6 7.05 8.05T5 13q0 2.9 2.05 4.95T12 20Zm0-7Z"
			/>
		</svg>
		<svg
			id="calender.svg"
			viewBox="0 0 24 24"
			class="svg-tab {tab == 'calender' ? 'fill-green-300' : 'fill-slate-400'}"
			on:click={() => (tab = "calender")}
		>
			<path
				d="M5 22q-.825 0-1.413-.588T3 20V6q0-.825.588-1.413T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.588 1.413T19 22H5Zm0-2h14V10H5v10ZM5 8h14V6H5v2Zm0 0V6v2Zm7 6q-.425 0-.713-.288T11 13q0-.425.288-.713T12 12q.425 0 .713.288T13 13q0 .425-.288.713T12 14Zm-4 0q-.425 0-.713-.288T7 13q0-.425.288-.713T8 12q.425 0 .713.288T9 13q0 .425-.288.713T8 14Zm8 0q-.425 0-.713-.288T15 13q0-.425.288-.713T16 12q.425 0 .713.288T17 13q0 .425-.288.713T16 14Zm-4 4q-.425 0-.713-.288T11 17q0-.425.288-.713T12 16q.425 0 .713.288T13 17q0 .425-.288.713T12 18Zm-4 0q-.425 0-.713-.288T7 17q0-.425.288-.713T8 16q.425 0 .713.288T9 17q0 .425-.288.713T8 18Zm8 0q-.425 0-.713-.288T15 17q0-.425.288-.713T16 16q.425 0 .713.288T17 17q0 .425-.288.713T16 18Z"
			/>
		</svg>
	</section>

	<section
		id="content-section"
		class="grow flex flex-col overflow-auto divide-y divide-slate-500"
		use:dndzone={{
			items: entrys,
			flipDurationMs: 200,
			dragDisabled: !edit_mode,
		}}
		on:consider={on_dnd_event}
		on:finalize={on_dnd_event}
	>
		{#each entrys as it (it.id)}
			<div class="relative" animate:flip={{ duration: 200 }}>
				<div class="w-8 flex justify-center items-center bg-red-500">
					<svg
						id="remove.svg"
						viewBox="0 0 24 24"
						class="w-8 fill-white scale-75 hover:scale-100 cursor-pointer"
						on:click={() => del_entry(it.id)}
					>
						<path
							d="m9.4 16.5l2.6-2.6l2.6 2.6l1.4-1.4l-2.6-2.6L16 9.9l-1.4-1.4l-2.6 2.6l-2.6-2.6L8 9.9l2.6 2.6L8 15.1l1.4 1.4ZM7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7ZM17 6H7v13h10V6ZM7 6v13V6Z"
						/>
					</svg>
				</div>
				<div
					class="w-full absolute top-0 left-0 z-10 transition duration-150 ease-out {edit_mode
						? 'translate-x-8'
						: 'translate-x-0'}"
				>
					<Span bind:entry={it} on:trigger={play_notification_sound} />
				</div>
			</div>
		{/each}
	</section>

	<section id="footer-section" class="flex-none relative h-6 w-full">
		<div class="fixed inset-x-0 w-full border-b border-gray-800" />
		<div class="fixed bottom-0 left-0 font-mono text-slate-300">
			{date_time}
		</div>
	</section>
</main>

<style lang="postcss">
	.svg-btn-nf {
		@apply h-full w-8 scale-75 hover:scale-90 hover:fill-green-300;
	}
	.svg-btn {
		@apply svg-btn-nf fill-slate-300;
	}
	.svg-tab {
		@apply h-full w-8 scale-75 hover:fill-green-300;
	}
</style>
