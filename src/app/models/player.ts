import {PlayerAlignment} from "./player-alignment.enum";

export interface Player {
  $key: string;
  name: string;
  alignment: PlayerAlignment;
  ready: boolean;
  owner: boolean;
}
