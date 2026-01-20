import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private spotifyService: SpotifyService) {}

  loginWithSpotify(): void {
    this.spotifyService.login();
  }
}
