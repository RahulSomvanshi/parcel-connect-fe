import { AuthService } from '../services/auth.service';

/** Sync session from server before first route resolves (fixes refresh role bugs). */
export function authInitializer(authService: AuthService): () => Promise<void> {
  return () => authService.bootstrap();
}
