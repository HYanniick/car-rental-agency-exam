import { Injectable } from '@angular/core';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { BehaviorSubject } from 'rxjs';
import { ICar } from 'src/app/models/car.interface';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private carsSubject = new BehaviorSubject<ICar[]>([]);
  public cars$ = this.carsSubject.asObservable();

  constructor() {
    this.loadAllCars();
  }

  private loadAllCars(): void {
    const carsRef = ref(getDatabase(), 'cars/');
    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      const cars: ICar[] = [];
      if (data) {
        Object.entries(data).forEach(([, value]) => {
          cars.push(value as ICar);
        });
      }
      this.carsSubject.next(cars); // Met à jour les voitures
    });
  }

  public async saveCar(car: ICar): Promise<void> {
    try {
      const carRef = ref(getDatabase(), 'cars/' + car.licensePlate);

      await set(carRef, {
        licensePlate: car.licensePlate,
        brand: car.brand,
        model: car.model,
        photos: car.photos,
      });

      this.loadAllCars();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la voiture:", error);
      throw error;
    }
  }

  public getCarByLicensePlate(licensePlate: string): Promise<ICar | null> {
    return new Promise((resolve, reject) => {
      const carRef = ref(getDatabase(), 'cars/' + licensePlate);
      onValue(
        carRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            resolve(data as ICar);
          } else {
            resolve(null);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
