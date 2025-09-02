import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-home',
  imports: [ CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatListModule, MatButtonModule, MatRippleModule,
    NgxMaskDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
   constructor() {
   }

   ngOnInit() {
   }



   addPatient(){}
}
