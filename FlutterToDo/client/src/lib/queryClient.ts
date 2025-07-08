import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { localAPI } from './localStorage-api';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Симуляция API запросов через localStorage для production
async function simulateApiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Имитация задержки

  try {
    if (url === '/api/transactions') {
      if (method === 'GET') {
        const transactions = localAPI.getTransactions();
        return new Response(JSON.stringify(transactions), { status: 200 });
      }
      if (method === 'POST') {
        const transaction = localAPI.addTransaction(data as any);
        return new Response(JSON.stringify(transaction), { status: 201 });
      }
    }

    if (url.startsWith('/api/transactions/') && method === 'DELETE') {
      const id = parseInt(url.split('/').pop() || '0');
      localAPI.deleteTransaction(id);
      return new Response(JSON.stringify({ message: 'Удалено' }), { status: 200 });
    }

    if (url === '/api/events') {
      if (method === 'GET') {
        const events = localAPI.getEvents();
        return new Response(JSON.stringify(events), { status: 200 });
      }
      if (method === 'POST') {
        const event = localAPI.addEvent(data as any);
        return new Response(JSON.stringify(event), { status: 201 });
      }
    }

    if (url.startsWith('/api/events/') && method === 'PUT') {
      const id = parseInt(url.split('/').pop() || '0');
      const event = localAPI.updateEvent(id, data as any);
      return new Response(JSON.stringify(event), { status: 200 });
    }

    if (url.startsWith('/api/events/') && method === 'DELETE') {
      const id = parseInt(url.split('/').pop() || '0');
      localAPI.deleteEvent(id);
      return new Response(JSON.stringify({ message: 'Удалено' }), { status: 200 });
    }

    if (url === '/api/stats') {
      const stats = localAPI.getStats();
      return new Response(JSON.stringify(stats), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Не найдено' }), { status: 404 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Ошибка сервера' }), { status: 500 });
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // ВСЕГДА используем localStorage для API запросов в любой среде, кроме точного localhost
  const isExactLocalhost = window.location.hostname === 'localhost' && 
                           window.location.port === '5000';
  
  console.log('🔍 API Debug:', {
    hostname: window.location.hostname,
    port: window.location.port,
    href: window.location.href,
    isExactLocalhost,
    method,
    url
  });

  // Используем localStorage для ВСЕГО кроме localhost:5000
  if (!isExactLocalhost && url.startsWith('/api/')) {
    console.log('🟢 FORCED localStorage API activation');
    return simulateApiRequest(method, url, data);
  }

  // Только для localhost пробуем реальный сервер
  console.log('Trying real server for localhost...');
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.log('Server failed, using localStorage fallback');
    return simulateApiRequest(method, url, data);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
