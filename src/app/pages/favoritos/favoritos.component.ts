import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MusicaListComponent } from '../../components/tabela/music-table';
import { MusicaService } from '../../services/musica.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, ButtonModule, MusicaListComponent],
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent {
  private musicaService = inject(MusicaService);

  musicasFavoritas = this.musicaService.musicasFavoritas;

  onMusicaRemovida(id: number) {
    this.musicaService.removerMusica(id);
  }

  onFavoritoAlterado(id: number) {
    this.musicaService.toggleFavorito(id);
  }
}
