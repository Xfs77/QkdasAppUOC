import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Match } from '../../../../shared/validators/match.validator';
import { User } from '../../../../core/user/user.models';

@Component({
  selector: 'anms-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {

  @Input() user: User = {} as User;
  @Output() saveUserEvent: EventEmitter<User> = new EventEmitter<User>();
  @Output() cancelUserEvent: EventEmitter<{edit: boolean}> = new EventEmitter<{edit: boolean}>();

  signupForm: FormGroup;

  validationMessages = {
    name: [
      { type: 'required', message: 'El nombre debe informarse' }
    ],
    surname: [
      { type: 'required', message: 'Los apellidos deben informarse' }
    ],
    email: [
      { type: 'required', message: 'El email debe informarse' },
      { type: 'email', message: 'El email informado debe ser válido' },

    ],
    phone1: [
      { type: 'required', message: 'El teléfono debe informarse' }
    ],
    phone2: [],
    password: [
      { type: 'required', message: 'La contraseña debe informarse' },
      { type: 'minlength', message: 'La contraseña debe tener un mínimo de 6 carácteres' }

    ],
    repassword: [
      { type: 'mustMatch', message: 'Las dos contraseñas no coinciden'}
    ]
  };

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
    if (!this.user.id) {
      (this.signupForm.get('passwordGroup') as FormGroup).get('password').setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  private createForm() {
    this.signupForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      name: [this.user.name, [Validators.required]],
      surname: [this.user.surname, [Validators.required]],
      phone1: [this.user.phone1, [Validators.required]],
      phone2: [this.user.phone2],
      passwordGroup: this.fb.group({
          password: [null],
          repassword: [null]
        },
        {validator: Match('password', 'repassword')
        })
    });
  }

  get email() {
    return this.signupForm.get('email') ;
  }

  get name() {
    return this.signupForm.get('name');
  }

  get surname() {
    return this.signupForm.get('surname');
  }

  get phone1() {
    return this.signupForm.get('phone1');
  }

  get phone2() {
    return this.signupForm.get('phone2');
  }

  get password() {
    return this.signupForm.get('passwordGroup').get('password')
      ;
  }

  get repassword() {
    return this.signupForm.get('passwordGroup').get('repassword');
  }

  onSave() {
    if (this.signupForm.valid) {
      this.saveUserEvent.emit(this.getFormData());
    }
  }

  onCancel() {
    this.cancelUserEvent.emit({edit: !!this.user.id});
  }

  getFormData()  {
    const user = Object.assign({}, this.user);
    user.email = this.email.value;
    user.name = this.name.value;
    user.surname = this.surname.value;
    user.phone1 = this.phone1.value;
    user.phone2 = this.phone2.value;
    user.password = this.password.value;
    if (user.admin === undefined) {
      user.admin = false;
    }
    return user;
  }

}
