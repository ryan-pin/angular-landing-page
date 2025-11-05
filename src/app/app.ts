import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Musica } from '../models/musica';
import { MusicaFormComponent } from './components/formulario/music-form';
import { MusicaListComponent } from './components/tabela/music-table';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MusicaFormComponent, MusicaListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Playlist de Músicas');

  musicas = signal<Musica[]>([]);
  proximoId = signal(1);

  onMusicaCadastrada(musicaData: Omit<Musica, 'id'>) {
    const novaMusica: Musica = {
      id: this.proximoId(),
      ...musicaData,
    };

    this.musicas.update((musicas) => [...musicas, novaMusica]);
    this.proximoId.update((id) => id + 1);
  }

  onMusicaRemovida(id: number) {
    this.musicas.update((musicas) => musicas.filter((m) => m.id !== id));
  }

  onFavoritoAlterado(id: number) {
    this.musicas.update((musicas) =>
      musicas.map((m) => (m.id === id ? { ...m, favorito: !m.favorito } : m))
    );
  }
}
