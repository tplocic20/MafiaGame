import {Pipe, PipeTransform} from '@angular/core';
import {Player} from "../../../models/player";
import {PlayerAlignment} from "../../../models/player-alignment.enum";

@Pipe({
  name: 'filterMafiaOnly'
})
export class FilterMafiaOnlyPipe implements PipeTransform {

  transform(items: any): unknown {
    const value = Object.values(items) as Player[];
    return value ? value.filter(item => item.alignment === PlayerAlignment.Mafia) : [];
  }

}
