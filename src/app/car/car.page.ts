import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { Router } from '@angular/router';
import { CarService } from '../core/services/car/car.service';
import { ICar } from '../models/car.interface';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { ToastController } from "@ionic/angular/standalone";
import { powerOutline } from 'ionicons/icons';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ]
})
export class CarPage implements OnInit {

  public cars: ICar[] = [];
  public isLoggedIn = false;

  constructor(
    private router: Router,
    private carService: CarService,
    private toastController: ToastController,
    private authenticationService: AuthenticationService
  ) {
    addIcons({ powerOutline });
  }

  ngOnInit(): void {
    this.carService.cars$.subscribe({
      next: (cars) => {
        this.cars = cars;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des voitures:', error);
        this.errorToast("Failed to load cars. Please try again later.");
      }
    });

    this.authenticationService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  public onCreationCar(): void {
    this.router.navigate(['/car/create']);
  }

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  public seeDetailsCar(car: ICar): void {
    this.router.navigate([`/car/detail/${car.licensePlate}`]);
  }

  public onLogout(): void {
    this.authenticationService.logout()
      .then(() => {
        console.log('Déconnexion réussie');
        this.router.navigate(['/login']);
        this.successToast("Successfully logged out.");
      })
      .catch((error) => {
        console.error('Error during logout:', error);
        this.errorToast("An error occurred. Please try again later.");
      });
  }

  private async errorToast(errorMessage: string): Promise<void> {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: 3000,
      position: 'top',
      color: 'danger',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  private async successToast(successMessage: string): Promise<void> {
    const toast = await this.toastController.create({
      message: successMessage,
      duration: 3000,
      position: 'top',
      color: 'success',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  public navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

}
