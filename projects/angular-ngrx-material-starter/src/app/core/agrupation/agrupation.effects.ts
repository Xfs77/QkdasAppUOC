import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
  agrupationGet,
  agrupationGetFailure,
  agrupationGetSuccess, agrupationRemove,
  agrupationRemoveFailure,
  agrupationRemoveSuccess,
  agrupationUpdate,
  agrupationUpdateFailure,
  agrupationUpdateSuccess
} from './agrupation.action';
import { Agrupation } from './agrupation.models';
import { AgrupationService } from './agrupation.service';
import { DynamicDatabase } from '../../features/agrupations-wrapper/agrupations/DynamicDatabase';
import { DynamicFlatNode } from '../../features/agrupations-wrapper/agrupations/DynamicFlatNode';


@Injectable()
export class AgrupationEffects {
  constructor(
    private actions$: Actions,
    public database: DynamicDatabase,
    private agrupationService: AgrupationService,
    private router: Router
  ) {
  }

  agrupationGet = createEffect(
    () =>
      this.actions$.pipe(
        ofType(agrupationGet),
        mergeMap(action =>
          this.agrupationService.getAgrupations(action.payload.agrupation).get().pipe(
            map(agrupDocsArray => agrupDocsArray.docs.map(doc => doc.data())),
            map((agrupations: Agrupation[]) => (agrupationGetSuccess({
              payload: {
                agrupation: action.payload.agrupation,
                children: agrupations
              }
            }))),
            catchError(error => {
              return of(agrupationGetFailure({ payload: { message: error.message } }));
            })
          ))));
  agrupationGetSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(agrupationGetSuccess),
        map((action: any) =>  {
          const level = this.database.dataSource.getLevel(action.payload.agrupation);
           this.database.dataSource.addChildren(
             new DynamicFlatNode(action.payload.agrupation, level  , action.payload.agrupation.hasChildren),
             action.payload.children.map(item => new DynamicFlatNode(item, level + 1, item.hasChildren))
           );
        })
      ),
    {dispatch: false});
  agrupationUpdate = createEffect(
    () =>
      this.actions$.pipe(
        ofType(agrupationUpdate),
        mergeMap(action => {
          return from(this.agrupationService.addAgrupation(action.payload.agrupation, action.payload.edit)).pipe(
            map(res => {
              return agrupationUpdateSuccess({
                payload: {
                  parent: action.payload.parent,
                  agrupation: action.payload.agrupation
                }
              })
            }),
            catchError(error => {
              return of(agrupationUpdateFailure({ payload: { message: error.message } }));
            })
          );
        })));
  agrupationUpdateSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(agrupationUpdateSuccess),
        map(action => agrupationGet({ payload: { agrupation: action.payload.parent } }))
      ));
  agrupationRemove = createEffect(
    () => this.actions$.pipe(
      ofType(agrupationRemove),
      mergeMap(action =>
        from(this.agrupationService.removeAgrupation(action.payload.agrupation)).pipe(
          map(res => agrupationRemoveSuccess({
            payload: {
              parent: action.payload.parent,
              agrupation: action.payload.agrupation
            }
          })),
          catchError(error => {
            return of(agrupationRemoveFailure({ payload: { message: error.message } }));
          })
        )
      )
    ));
  agrupationRemoveSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(agrupationRemoveSuccess),
        tap(action => {
          const level = this.database.dataSource.getLevel(action.payload.agrupation);
          this.database.dataSource.removeNode(new DynamicFlatNode(action.payload.parent, level -  1, action.payload.agrupation.hasChildren), new DynamicFlatNode(action.payload.agrupation, level ,  action.payload.agrupation.hasChildren))
        }
      )),
    {dispatch: false});
}
