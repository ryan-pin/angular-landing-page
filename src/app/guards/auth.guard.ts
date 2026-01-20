import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';

export const authGuard: CanActivateFn = () => {
  const spotifyService = inject(SpotifyService);
  const router = inject(Router);

  if (spotifyService.checkAuthStatus()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
