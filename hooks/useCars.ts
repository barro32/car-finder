import { useQuery } from '@tanstack/react-query';
import { Car } from '../types/car';

export function useCars() {
  return useQuery<{ cars: Car[] }, Error>({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await fetch('/api/cars');
      if (!res.ok) {
        const text = await res.text();
        console.error('API error:', res.status, text);
        throw new Error(`API error: ${res.status}`);
      }
      try {
        return await res.json();
      } catch (err) {
        const text = await res.text();
        console.error('JSON parse error. Response text:', text);
        throw err;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}
