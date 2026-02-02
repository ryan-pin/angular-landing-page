import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private spotifyService = inject(SpotifyService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos corretamente');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = this.signupForm.value;

    // Simular criação de conta e login
    setTimeout(() => {
      // Criar um token mock baseado no email
      const mockToken = `mock_token_${btoa(formData.email || 'user')}`;

      // Salvar token usando o método setToken do serviço
      this.spotifyService.setToken(mockToken, formData.name || 'Usuário');

      this.successMessage.set('Conta criada com sucesso!');
      this.isSubmitting.set(false);

      // Redirecionar para a página de músicas
      setTimeout(() => {
        this.router.navigate(['/musicas-ouvidas']);
      }, 1000);
    }, 500);
  }

  // Getters para facilitar validação no template
  get nameControl() {
    return this.signupForm.get('name');
  }

  get emailControl() {
    return this.signupForm.get('email');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }
}
