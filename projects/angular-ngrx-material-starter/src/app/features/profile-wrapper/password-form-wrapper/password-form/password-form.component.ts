import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Match } from '../../../../shared/validators/match.validator';

@Component({
  selector: 'anms-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordFormComponent implements OnInit {
  @Output() savePasswordEvent: EventEmitter<{password: string}> = new EventEmitter();
  @Output() cancelPasswordEvent: EventEmitter<boolean> = new EventEmitter();

  passwordForm: FormGroup;
  passwordData: {password: string} = {password: null};

  validationMessages = {
    newpassword: [
      { type: 'required', message: 'La contraseña debe informarse' },
      { type: 'minlength', message: 'La contraseña debe tener un mínimo de 6 carácteres' }

    ],
    newrepassword: [
      { type: 'mustMatch', message: 'Las dos contraseñas no coinciden'}
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
    this.passwordForm = this.fb.group({
      passwordGroup: this.fb.group({
          newpassword: ['', [Validators.required, Validators.minLength(6)]],
          newrepassword: [' ', [Validators.required, Validators.minLength(6)]]
        },
        {validator: Match('newpassword', 'newrepassword')
        })
    });
  }

  get newpassword() {
    return this.passwordForm.get('passwordGroup').get('newpassword');
  }

  get newrepassword() {
    return this.passwordForm.get('passwordGroup').get('newrepassword');
  }

  getFormData() {
    this.passwordData.password = this.newpassword.value;
  }

  onChange() {
    if (this.passwordForm.valid) {
      this.getFormData();
      this.savePasswordEvent.emit(this.passwordData);
    }
  }

  onCancel() {
    this.cancelPasswordEvent.emit(true);
  }
}


