import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/user/user.models';
import { Store } from '@ngrx/store';
import { userUpdate } from '../../../core/user/user.actions';
import { selectUserProfile } from '../../../core/user/user.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'anms-user-form-wrapper',
  templateUrl: './user-form-wrapper.component.html',
  styleUrls: ['./user-form-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormWrapperComponent {

  user$: Observable<User>;

  constructor(
    private store$: Store,
    private router: Router,
  ) {
    this.user$ = this.store$.select(selectUserProfile);
  }

  onSave(user: User) {
    console.log(user)
    this.store$.dispatch(userUpdate({payload: {user}}));
  }

  onCancel(edit: {edit: boolean}) {
    if (edit.edit) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/about']);
    }
  }
}
