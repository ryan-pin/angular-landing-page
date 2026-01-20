import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyRecentTrack } from '../../../models/spotify';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-musicas-ouvidas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './musicas-ouvidas.component.html',
  styleUrl: './musicas-ouvidas.component.css',
})
export class MusicasOuvidasComponent implements OnInit {
  recentTracks = signal<SpotifyRecentTrack[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed signals do serviço
  user = computed(() => this.spotifyService.user());
  isAuthenticated = computed(() => this.spotifyService.isAuthenticated());

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadRecentTracks();
  }

  private loadRecentTracks(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.spotifyService.getRecentlyPlayed(5).subscribe({
      next: (response) => {
        this.recentTracks.set(response.items);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar músicas:', error);
        this.error.set('Erro ao carregar suas músicas recentes. Tente novamente.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Converte duração de ms para formato mm:ss
   */
  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Formata a data de quando a música foi tocada
   */
  formatPlayedAt(playedAt: string): string {
    const date = new Date(playedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} min atrás`;
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
  }

  /**
   * Abre a música no Spotify
   */
  openInSpotify(track: SpotifyRecentTrack): void {
    window.open(track.track.external_urls.spotify, '_blank');
  }

  /**
   * Recarrega a lista de músicas
   */
  refreshTracks(): void {
    this.loadRecentTracks();
  }

  /**
   * Faz logout
   */
  logout(): void {
    this.spotifyService.logout();
  }
}
