import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { userChangePassword } from '../../../core/user/user.actions';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'anms-password-form-wrapper',
  templateUrl: './password-form-wrapper.component.html',
  styleUrls: ['./password-form-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFormWrapperComponent implements OnInit {

  constructor(
    private store$: Store,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onSave($event) {
    this.store$.dispatch(userChangePassword({payload: $event}))
  }

  onCancel() {
    this.dialog.closeAll();
    this.router.navigate(['/profile']);
  }
}
