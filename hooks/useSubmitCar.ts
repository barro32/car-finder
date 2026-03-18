import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Car } from '../types/car';

interface SubmitCarData {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  location: { lat: number; lng: number };
  imageUrl?: string;
}

export function useSubmitCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (carData: SubmitCarData): Promise<{ car: Car }> => {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to submit car: ${res.status} - ${text}`);
      }

      return res.json();
    },

    // Optimistic update
    onMutate: async (newCar) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cars'] });

      // Snapshot the previous value
      const previousCars = queryClient.getQueryData<{ cars: Car[] }>(['cars']);

      // Optimistically update to the new value
      if (previousCars) {
        const optimisticCar: Car = {
          id: Date.now(), // Temporary ID
          ...newCar,
          reportedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<{ cars: Car[] }>(['cars'], {
          cars: [...previousCars.cars, optimisticCar]
        });
      }

      // Return a context object with the snapshotted value
      return { previousCars };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newCar, context) => {
      if (context?.previousCars) {
        queryClient.setQueryData(['cars'], context.previousCars);
      }
    },

    // Always refetch after error or success to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}
