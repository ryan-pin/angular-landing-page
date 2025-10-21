import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Musica } from '../models/musica';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    TableModule,
    CardModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Playlist de Músicas');

  musicas = signal<Musica[]>([]);
  proximoId = signal(1);

  // Dados do formulário
  nome = signal('');
  duracao = signal<number>(0);
  favorito = signal(false);

  cadastrarMusica() {
    if (this.nome().trim() === '' || this.duracao() <= 0) {
      alert('Preencha o nome e duração corretamente!');
      return;
    }

    const novaMusica: Musica = {
      id: this.proximoId(),
      nome: this.nome(),
      duracao: this.duracao(),
      favorito: this.favorito(),
    };

    this.musicas.update((musicas) => [...musicas, novaMusica]);
    this.proximoId.update((id) => id + 1);

    // Limpar formulário
    this.nome.set('');
    this.duracao.set(0);
    this.favorito.set(false);
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
