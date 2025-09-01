import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-login',
  imports:[ CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,NgxMaskDirective, NgxMaskPipe
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
    hide = true;

    form = null as any;
    constructor(private fb: FormBuilder) {
        this.form = this.fb.nonNullable.group({
            // 11 dígitos quando dropSpecialCharacters = true
            cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        // TODO: autenticar
        console.log(this.form.getRawValue());
  }
}
