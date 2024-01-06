import { parse, stringify } from 'yaml';
import * as Neutralino from '@neutralinojs/lib';

interface BaseEntryConfig {
  name: string;
  duration?: number;
  repeat?: boolean;
  cal?: string;
}

export interface EntryConfig extends BaseEntryConfig {
  id: string;
}
export interface Entrys {
  [k: string]: EntryConfig;
}

const config_dir = async () => {
  const app_name = 'nomo';
  const home = await Neutralino.os.getEnv('HOME');
  const path = [home, '.config', app_name].join('/');
  Neutralino.filesystem.createDirectory(path).catch(_ => {
    console.log('failed to create directory', path);
  });
  return path;
}
const get_config_path = async (fn: string) => {
  const dir = await config_dir();
  return [dir, fn].join('/');
}

export const load_entrys = async () => {
  try {
    const config_file = await get_config_path('nomo.yaml');
    const contents = await Neutralino.filesystem.readFile(config_file);
    const entrys = parse(contents) as Entrys;
    const ret = Object.keys(entrys).map(id => {
      return {
        id,
        ...entrys[id]
      } as EntryConfig;
    });
    return ret;
  } catch (e) {
    console.log('failed to load config:', JSON.stringify(e));
    return [];
  }
}

export const save_entrys = async (entrys: EntryConfig[]) => {
  // deep copy
  const new_entrys = entrys.map(e => ({ ...e }));
  const conf = {};
  new_entrys.forEach(entry => {
    const id = entry.id;
    delete entry.id;
    conf[id] = entry;
  });

  const yaml = stringify(conf);

  try {
    const config_file = await get_config_path('nomo.yaml');
    await Neutralino.filesystem.writeFile(config_file, yaml);
  } catch (e) {
    console.log('failed to save config, yaml:', yaml, 'error:', JSON.stringify(e));
  }
}