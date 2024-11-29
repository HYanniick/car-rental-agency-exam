import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { AuthenticationService } from "../core/services/authentication/authentication.service";
import { Router } from "@angular/router";
import { IUser } from '../models/user.interface';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class LoginPage implements OnInit {

  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  public passwordType = 'password';
  public passwordIcon = 'eye-off-outline';

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private toastController: ToastController) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    if (this.authenticationService.getCurrentUser()) {
      this.router.navigate(['/profile']);
    }
  }

  public onToggleShowPassword(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off-outline';
    }
  }

  public onSignIn(): void {
    this.authenticationService.signInWithEmailAndPassword(this.loginForm.value as unknown as Partial<IUser>)
      .then(() => {
        this.router.navigate(['car']);
      }).catch((error) => {
      const errorCode = (error as { code: string }).code;
      const errorMessage = this.getErrorMessage(errorCode);
      this.presentErrorToast(errorMessage).then(r => console.log(r));
    });
  }


  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Email address or password is incorrect.';
      default:
        return 'An error occurred. Please try again later.';
    }
  }

  private async presentErrorToast(errorMessage: string) : Promise<void> {
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

  public navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

}
