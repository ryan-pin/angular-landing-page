import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../env/env';
import {
  SpotifyRecentTracksResponse,
  SpotifyTokenResponse,
  SpotifyUser,
} from '../../models/spotify';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = environment.spotify.clientId;
  private clientSecret = environment.spotify.clientSecret;
  private redirectUri = environment.spotify.redirectUri;
  private scopes = environment.spotify.scopes;

  private accessToken = signal<string | null>(null);
  private refreshToken = signal<string | null>(null);
  private currentUser = signal<SpotifyUser | null>(null);

  isAuthenticated = computed(() => !!this.accessToken());
  user = computed(() => this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    // Verificar se há tokens salvos no localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadTokensFromStorage();
    }
  }

  /**
   * Inicia o processo de login do Spotify
   */
  login(): void {
    const authUrl = this.buildAuthUrl();
    window.location.href = authUrl;
  }

  /**
   * Constrói a URL de autorização do Spotify
   */
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes.join(' '),
      redirect_uri: this.redirectUri,
      show_dialog: 'true',
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Processa o código de autorização retornado pelo Spotify
   */
  handleCallback(code: string): Observable<SpotifyTokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<SpotifyTokenResponse>('https://accounts.spotify.com/api/token', body.toString(), {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Erro ao trocar código por token:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Salva os tokens e busca informações do usuário
   */
  setTokens(tokenResponse: SpotifyTokenResponse): void {
    this.accessToken.set(tokenResponse.access_token);
    this.refreshToken.set(tokenResponse.refresh_token);

    // Salvar no localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('spotify_access_token', tokenResponse.access_token);
      localStorage.setItem('spotify_refresh_token', tokenResponse.refresh_token);
    }

    // Buscar informações do usuário
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.router.navigate(['/musicas-ouvidas']);
      },
      error: (error) => {
        console.error('Erro ao buscar usuário:', error);
      },
    });
  }

  /**
   * Login alternativo - salva um token mock para fazer login sem verificações
   * Usado para criar conta através do formulário
   */
  setToken(mockToken: string, userName: string): void {
    this.accessToken.set(mockToken);
    this.refreshToken.set(mockToken);

    // Salvar no localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('spotify_access_token', mockToken);
      localStorage.setItem('spotify_refresh_token', mockToken);
    }

    // Criar um usuário mock
    const mockUser: SpotifyUser = {
      id: `user_${Date.now()}`,
      display_name: userName,
      email: `${userName.toLowerCase().replace(/\s/g, '')}@example.com`,
      images: [],
    };

    this.currentUser.set(mockUser);
  }

  /**
   * Carrega tokens do localStorage
   */
  private loadTokensFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Não executar no servidor
    }

    const accessToken = localStorage.getItem('spotify_access_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');

    if (accessToken && refreshToken) {
      this.accessToken.set(accessToken);
      this.refreshToken.set(refreshToken);

      // Verificar se o token ainda é válido buscando o usuário
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser.set(user);
        },
        error: () => {
          // Token expirado, limpar
          this.logout();
        },
      });
    }
  }

  /**
   * Busca informações do usuário atual
   */
  getCurrentUser(): Observable<SpotifyUser> {
    const headers = this.getAuthHeaders();

    return this.http.get<SpotifyUser>('https://api.spotify.com/v1/me', { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao buscar usuário:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Busca as últimas músicas tocadas
   */
  getRecentlyPlayed(limit: number = 5): Observable<SpotifyRecentTracksResponse> {
    const headers = this.getAuthHeaders();
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    return this.http
      .get<SpotifyRecentTracksResponse>(
        `https://api.spotify.com/v1/me/player/recently-played?${params.toString()}`,
        { headers },
      )
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar músicas recentes:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Cria headers de autorização
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.accessToken();
    if (!token) {
      throw new Error('Token de acesso não encontrado');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Faz logout e limpa dados
   */
  logout(): void {
    this.accessToken.set(null);
    this.refreshToken.set(null);
    this.currentUser.set(null);

    // Limpar localStorage apenas no navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
    }

    this.router.navigate(['/login']);
  }

  /**
   * Verifica se o usuário está logado
   */
  checkAuthStatus(): boolean {
    return this.isAuthenticated();
  }
}
