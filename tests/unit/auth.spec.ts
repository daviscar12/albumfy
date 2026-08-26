import { describe, expect, it, beforeEach } from 'vitest';
import { authService } from '@/services/auth';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('registers a user and logs them in', () => {
    const user = authService.registerUser({
      name: 'Maria',
      email: 'maria@email.com',
      password: '123456',
    });

    expect(user.email).toBe('maria@email.com');
    expect(authService.getCurrentUser()?.email).toBe('maria@email.com');
  });

  it('rejects duplicate email and wrong password', () => {
    authService.registerUser({
      name: 'Joao',
      email: 'joao@email.com',
      password: '123456',
    });

    expect(() =>
      authService.registerUser({
        name: 'Outro',
        email: 'joao@email.com',
        password: '654321',
      }),
    ).toThrow('already registered');

    expect(() =>
      authService.loginUser({
        email: 'joao@email.com',
        password: 'senha-errada',
      }),
    ).toThrow('Invalid email');
  });
});
