import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FRONTEND_LOGIN_URL } from '../api.config';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // 1. Intentar obtener token de la URL
  const tokenFromUrl = route.queryParams['token'];

  if (tokenFromUrl) {
    authService.setToken(tokenFromUrl);
    return true; // Permite el paso porque acaba de recibir el token
  }

  // 2. Si no hay en URL, revisar si ya está logueado
  if (authService.isLoggedIn()) {
    return true;
  }

  // 3. Si no hay nada, al login
  window.location.href = FRONTEND_LOGIN_URL;
  return false;
};
