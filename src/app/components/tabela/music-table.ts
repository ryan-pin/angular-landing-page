import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Musica } from '../../../models/musica';

@Component({
  selector: 'app-musica-list',
  standalone: true,
  imports: [ButtonModule, CardModule, TableModule, TooltipModule],
  templateUrl: './music-table.html',
})
export class MusicaListComponent {
  musicas = input.required<Musica[]>();

  musicaRemovida = output<number>();
  favoritoAlterado = output<number>();

  removerMusica(id: number) {
    this.musicaRemovida.emit(id);
  }

  toggleFavorito(id: number) {
    this.favoritoAlterado.emit(id);
  }
}
