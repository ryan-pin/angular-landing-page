import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { CallbackComponent } from './pages/callback/callback.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ListaMusicasComponent } from './pages/lista-musicas/lista-musicas.component';
import { LoginComponent } from './pages/login/login.component';
import { MusicasOuvidasComponent } from './pages/musicas-ouvidas/musicas-ouvidas.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login - Spotify Integration',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Criar Conta - Spotify Integration',
  },
  {
    path: 'callback',
    component: CallbackComponent,
    title: 'Conectando...',
  },
  {
    path: 'musicas-ouvidas',
    component: MusicasOuvidasComponent,
    title: 'Músicas Ouvidas - Spotify',
    canActivate: [authGuard],
  },
  {
    path: 'lista-musicas',
    component: ListaMusicasComponent,
    title: 'Playlist de Músicas',
  },
  {
    path: 'favoritos',
    component: FavoritosComponent,
    title: 'Músicas Favoritas',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
