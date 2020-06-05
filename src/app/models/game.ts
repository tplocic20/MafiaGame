import {Player} from "./player";
import { GameState } from './game-state.enum';

export interface Game {
  players: Player[];
  state: GameState;
  accessCode: string;
}
