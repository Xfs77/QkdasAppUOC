import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'anms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  @Output() loginEvent: EventEmitter<{email: string, password: string}> = new EventEmitter();

  loginForm: FormGroup;
  loginData: {email: string, password: string} = {email: null, password: null};

  validationMessages = {
    email: [
      { type: 'email', message: 'El email informado debe ser válido' },

    ],
    password: [
      { type: 'minlength', message: 'La contraseña debe tener un mínimo de 6 carácteres' }

    ]
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog

) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email]],
      password: [null, [Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email') ;
  }

  get password() {
    return this.loginForm.get('password') ;
  }

  getFormData() {
    this.loginData.email = this.email.value;
    this.loginData.password = this.password.value;
  }

  onLogin() {
    this.getFormData();
    this.loginEvent.emit(this.loginData);
  }

  onRegister() {
    this.dialog.closeAll();
  }
}
