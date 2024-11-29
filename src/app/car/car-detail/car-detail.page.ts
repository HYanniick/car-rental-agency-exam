import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import {ActivatedRoute, Router} from '@angular/router';
import { ICar } from 'src/app/models/car.interface';
import { CarService } from 'src/app/core/services/car/car.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CarDetailPage implements OnInit {

  car: ICar | null = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private carService: CarService, private router: Router) {}

  ngOnInit(): void {
    const licensePlate = this.route.snapshot.paramMap.get('licensePlate');
    if (licensePlate) {
      this.carService.getCarByLicensePlate(licensePlate).then(
        (car) => {
          if (car) {
            this.car = {
              ...car,
              photos: car.photos || { front: '', back: '' },
            };
          } else {
            this.errorMessage = 'Voiture introuvable.';
          }
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des détails de la voiture.';
          console.error(error);
        }
      );
    }
  }

  public navigateToHome(): void {
    this.router.navigate(['/car']);
  }
}
