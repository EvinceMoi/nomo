import './App.css';
import App from "./App.svelte";
import { init } from './init';

init();

const app = new App({ 
  target: document.getElementById("app")!, 
});

export default app;
