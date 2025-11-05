import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Musica } from '../../../models/musica';

@Component({
  selector: 'app-musica-form',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
  ],
    templateUrl: './music-form.html',
})
export class MusicaFormComponent {
  musicaCadastrada = output<Omit<Musica, 'id'>>();

  nome = signal('');
  duracao = signal<number>(0);
  favorito = signal(false);

  cadastrarMusica() {
    if (this.nome().trim() === '' || this.duracao() <= 0) {
      alert('Preencha o nome e duração corretamente!');
      return;
    }

    this.musicaCadastrada.emit({
      nome: this.nome(),
      duracao: this.duracao(),
      favorito: this.favorito(),
    });

    // Limpar formulário
    this.limparFormulario();
  }

  private limparFormulario() {
    this.nome.set('');
    this.duracao.set(0);
    this.favorito.set(false);
  }
}
