import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { authLogin } from '../../core/auth/auth.actions';
import { LocalStorageService } from '../../core/local-storage/local-storage.service';
import { AUTH_KEY } from '../../core/auth/auth.effects';
import { AppSettings } from '../../app/app.settings';

@Component({
  selector: 'anms-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrls: ['./login-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginWrapperComponent implements OnInit {

  constructor(
    private store: Store,
    private lss: LocalStorageService,
  ) { }

  ngOnInit(): void {

  }

  onLogin($event: { email: string; password: string }) {
    this.lss.setItem(AppSettings.USER_KEY, {email: $event.email, password: $event.password});
    this.store.dispatch(authLogin({payload: $event}))
  }
}
