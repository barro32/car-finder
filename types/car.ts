export type Car = {
  id: number;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  location: { lat: number; lng: number };
  reportedAt: string;
};

export type Location = { lat: number; lng: number } | null;
