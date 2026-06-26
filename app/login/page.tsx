'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const username = String(form.get('username') ?? '');
    const password = String(form.get('password') ?? '');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!response.ok) {
      if (response.status === 500) {
        setError(
          'Сервер не настроен: проверьте AUTH_SECRET и AUTH_USERS в Vercel → Settings → Environment Variables, затем Redeploy.',
        );
      } else {
        setError('Неверный логин или пароль');
      }
      return;
    }

    router.push(next);
    router.refresh();
  };

  return (
    <div className="login-page">
      <div className="card login-card">
        <h1>Art Learning Hub</h1>
        <p>Введите логин и пароль для доступа к материалам.</p>
        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="username">Логин</label>
            <input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
