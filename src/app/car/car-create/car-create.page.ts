import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { Router } from '@angular/router';
import { CarService } from 'src/app/core/services/car/car.service';
import { ICar } from 'src/app/models/car.interface';

@Component({
  selector: 'app-car-create',
  templateUrl: './car-create.page.html',
  styleUrls: ['./car-create.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ]
})
export class CarCreatePage implements OnInit {
  public carForm = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    licensePlate: new FormControl('', [Validators.required]),
  });

  public frontPhotoBase64: string | null = null;
  public backPhotoBase64: string | null = null;
  public previewFrontPhoto: string | null = null;
  public previewBackPhoto: string | null = null;

  constructor(private router: Router, private carService: CarService) {}

  ngOnInit = (): void => {};

  public onSaveCar(): void {
    if (this.carForm.invalid || !this.frontPhotoBase64 || !this.backPhotoBase64) {
      return;
    }

    const formValues = this.carForm.value;
    const newCar: ICar = {
      licensePlate: formValues.licensePlate ?? '',
      brand: formValues.brand ?? '',
      model: formValues.model ?? '',
      photos: {
        front: this.frontPhotoBase64,
        back: this.backPhotoBase64,
      },
    };

    this.carService.saveCar(newCar).then(() => {
      this.router.navigate(['/car']);
    }).catch((error) => {
      console.error('Erreur lors de la création de la voiture:', error);
    });
  }

  public onFileChange(event: Event, photoType: 'frontPhoto' | 'backPhoto'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;
      if (photoType === 'frontPhoto') {
        this.frontPhotoBase64 = base64;
        this.previewFrontPhoto = base64;
      } else {
        this.backPhotoBase64 = base64;
        this.previewBackPhoto = base64;
      }
    };

    reader.readAsDataURL(file);
  }
}
