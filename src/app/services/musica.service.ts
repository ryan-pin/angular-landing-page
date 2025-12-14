import { computed, Injectable, signal } from '@angular/core';
import { Musica } from '../../models/musica';

@Injectable({
  providedIn: 'root',
})
export class MusicaService {
  private musicas = signal<Musica[]>([]);
  private proximoId = signal(1);

  // Computed para retornar apenas as músicas favoritas
  musicasFavoritas = computed(() => this.musicas().filter((m) => m.favorito));

  // Computed para retornar todas as músicas
  todasMusicas = computed(() => this.musicas());

  cadastrarMusica(musicaData: Omit<Musica, 'id'>) {
    const novaMusica: Musica = {
      id: this.proximoId(),
      ...musicaData,
    };

    this.musicas.update((musicas) => [...musicas, novaMusica]);
    this.proximoId.update((id) => id + 1);
  }

  removerMusica(id: number) {
    this.musicas.update((musicas) => musicas.filter((m) => m.id !== id));
  }

  toggleFavorito(id: number) {
    this.musicas.update((musicas) =>
      musicas.map((m) => (m.id === id ? { ...m, favorito: !m.favorito } : m))
    );
  }
}
