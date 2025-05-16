'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checarToken } from '../actions/checarToken';
import Cookies from 'js-cookie';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [sessaoValida, setSessaoValida] = useState(false);

  useEffect(() => {
    const verificarToken = async () => {
      const token = Cookies.get('auth_token') ?? "";
      if (!token) {
        router.push('/login');
        return;
      }

      const result = await checarToken(token);
      const valido = result?.login?.success;

      if (!valido) {
        Cookies.remove('auth_token');
        router.push('/login');
        return;
      }

      setSessaoValida(true);
      setVerificando(false);
    };

    verificarToken();
  }, [router]);

  if (verificando) {
    return null; // ou um loading spinner se quiser
  }

  return <>{sessaoValida && children}</>;
}
