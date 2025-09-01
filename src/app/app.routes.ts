// src/app/app.routes.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },



];
