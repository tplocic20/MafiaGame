import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {GameService} from "../game.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class JoinGuard implements CanActivate {
  constructor(private readonly gameService: GameService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return combineLatest([this.gameService.game, this.gameService.me]).pipe(
      map(([game, me]) => !!game && !!me)
    );
  }

}
