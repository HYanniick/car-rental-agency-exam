export interface ICar {
  licensePlate: string;
  brand: string;
  model: string;
  photos?: {
    front: string;
    back: string;
  };
}
