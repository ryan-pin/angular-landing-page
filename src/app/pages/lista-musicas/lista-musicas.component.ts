import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Musica } from '../../../models/musica';
import { MusicaFormComponent } from '../../components/formulario/music-form';
import { MusicaListComponent } from '../../components/tabela/music-table';
import { MusicaService } from '../../services/musica.service';

@Component({
  selector: 'app-lista-musicas',
  standalone: true,
  imports: [RouterLink, ButtonModule, MusicaFormComponent, MusicaListComponent],
  templateUrl: './lista-musicas.component.html',
})
export class ListaMusicasComponent {
  private musicaService = inject(MusicaService);

  musicas = this.musicaService.todasMusicas;

  onMusicaCadastrada(musicaData: Omit<Musica, 'id'>) {
    this.musicaService.cadastrarMusica(musicaData);
  }

  onMusicaRemovida(id: number) {
    this.musicaService.removerMusica(id);
  }

  onFavoritoAlterado(id: number) {
    this.musicaService.toggleFavorito(id);
  }
}
