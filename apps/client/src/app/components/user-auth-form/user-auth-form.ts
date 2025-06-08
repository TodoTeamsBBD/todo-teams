import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface FormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validators?: any[];
}

@Component({
  selector: 'app-user-auth-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-auth-form.html',
  styleUrl: './user-auth-form.css'
})
export class UserAuthForm {
  @Input() title: string = 'Welcome!';
  @Input() subtitle: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = 'Submit';
  @Input() fields: FormField[] = [];
  @Input() footerText: string = '';
  @Input() footerLink: string = '';
  @Input() footerLinkText: string = '';

  @Output() formSubmit = new EventEmitter<any>();

  authForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
    this.buildForm();
  }

  buildForm() {
    const formControls: any = {};

    this.fields.forEach(field => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      if (field.validators) {
        validators.push(...field.validators);
      }

      formControls[field.name] = ['', validators];
    });

    this.authForm = this.fb.group(formControls);
  }

  onSubmit() {
    if (this.authForm.valid) {
      this.formSubmit.emit(this.authForm.value);
    } else {
      Object.keys(this.authForm.controls).forEach(key => {
        this.authForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.authForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const field = this.fields.find(f => f.name === fieldName);
    return field?.label || fieldName;
  }
}
