import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { authLogin } from '../../core/auth/auth.actions';
import { $e } from 'codelyzer/angular/styles/chars';

@Component({
  selector: 'anms-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrls: ['./login-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginWrapperComponent implements OnInit {

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
  }

  onLogin($event: { email: string; password: string }) {
    this.store.dispatch(authLogin({payload: $event}))
  }
}
