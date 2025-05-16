'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checarToken } from '../actions/checarToken';
import Cookies from 'js-cookie';

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const verificarToken = async () => {
      const token = Cookies.get('auth_token') ?? "";
      if (!token) {
        router.push('/login');
        return;
      }

      const result = await checarToken(token);
      const sessaoValida = result?.login.success;

      if (!sessaoValida) {
        Cookies.remove('auth_token');
        router.push('/login');
      }
    };

    verificarToken();
  }, []);

  return <>{children}</>;
}
