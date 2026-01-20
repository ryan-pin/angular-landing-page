import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="loader-card">
        <div class="spinner"></div>
        <h2>Conectando com Spotify...</h2>
        <p>Por favor, aguarde enquanto processamos sua autenticação</p>

        @if (error) {
        <div class="error-message">
          <h3>Erro na autenticação</h3>
          <p>{{ error }}</p>
          <button (click)="tryAgain()" class="retry-btn">Tentar Novamente</button>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .callback-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #1db954 0%, #191414 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .loader-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 3rem;
        text-align: center;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #1db954;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 2rem auto;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      h2 {
        color: #191414;
        margin-bottom: 1rem;
        font-size: 1.5rem;
      }

      p {
        color: #666;
        margin-bottom: 2rem;
      }

      .error-message {
        background: #ffe6e6;
        border: 1px solid #ff9999;
        border-radius: 10px;
        padding: 1.5rem;
        margin-top: 2rem;
      }

      .error-message h3 {
        color: #cc0000;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      .retry-btn {
        background: #1db954;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 24px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
        margin-top: 1rem;
      }

      .retry-btn:hover {
        background: #1ed760;
      }
    `,
  ],
})
export class CallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        this.error = 'Acesso negado pelo usuário.';
        return;
      }

      if (code) {
        this.handleAuthCode(code);
      } else {
        this.error = 'Código de autorização não encontrado.';
      }
    });
  }

  private handleAuthCode(code: string): void {
    this.spotifyService.handleCallback(code).subscribe({
      next: (tokenResponse) => {
        this.spotifyService.setTokens(tokenResponse);
        // O redirecionamento é feito automaticamente no setTokens
      },
      error: (error) => {
        console.error('Erro no callback:', error);
        this.error = 'Erro ao processar autenticação. Tente novamente.';
      },
    });
  }

  tryAgain(): void {
    this.router.navigate(['/login']);
  }
}
