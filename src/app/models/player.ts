import {PlayerAlignment} from "./player-alignment.enum";
import {PlayerState} from "./player-state.enum";

export interface Player {
  $key: string;
  name: string;
  alignment: PlayerAlignment;
  state: PlayerState;
  ready: boolean;
  owner: boolean;
  markedByMe: string;
  mafiaMarked: boolean;
  exileMarked: string[];
}
