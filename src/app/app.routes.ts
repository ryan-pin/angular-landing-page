import { Routes } from '@angular/router';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ListaMusicasComponent } from './pages/lista-musicas/lista-musicas.component';

export const routes: Routes = [
  {
    path: '',
    component: ListaMusicasComponent,
    title: 'Playlist de Músicas',
  },
  {
    path: 'favoritos',
    component: FavoritosComponent,
    title: 'Músicas Favoritas',
  },
];
