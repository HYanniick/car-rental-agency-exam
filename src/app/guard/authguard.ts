import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService,
              private router: Router,
              private toastController: ToastController
  ) { }

  public async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (user) {
      return true;
    } else {
      await this.errorToast("You must first authenticate");
      await this.router.navigate(['/login']);
      return false;
    }
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
}
