import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { AuthenticationService } from "../core/services/authentication/authentication.service";
import { Router } from "@angular/router";
import { IUser } from '../models/user.interface';
import {ToastController} from "@ionic/angular/standalone";
import {
  emailValidator,
  fullNameValidator, passwordMatchValidator,
  phoneNumberValidator,
  strongPasswordValidator
} from "../core/validators/validators";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ]
})
export class RegisterPage implements OnInit {
  public registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, fullNameValidator()]),
    email: new FormControl('', [Validators.required, emailValidator()]),
    phoneNumber: new FormControl('', [Validators.required, phoneNumberValidator()]),
    password: new FormControl('', [Validators.required, strongPasswordValidator()]),
    confirmPassword: new FormControl('', [Validators.required, passwordMatchValidator()]),
  });

  public passwordType = 'password';
  public confirmPasswordType = 'password';
  public passwordIcon = 'eye-outline';
  public confirmPasswordIcon = 'eye-outline';

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private toastController: ToastController) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ngOnInit = () => {};

  public onToggleShowPassword(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-off-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-outline';
    }
  }

  public onToggleShowConfirmPassword(): void {
    if (this.confirmPasswordType === 'password') {
      this.confirmPasswordType = 'text';
      this.confirmPasswordIcon = 'eye-off-outline';
    } else {
      this.confirmPasswordType = 'password';
      this.confirmPasswordIcon = 'eye-outline';
    }
  }

  public onSignUp(): void {
    this.authenticationService.signUpWithEmailAndPassword(this.registerForm.value as unknown as IUser)
      .then((userCreated: boolean | unknown) => {
        if (userCreated) {
          this.router.navigate(['car']);
        }
      }).catch((error) => {
      const errorCode = (error as { code: string }).code;
      const errorMessage = this.getErrorMessage(errorCode);
      this.errorToast(errorMessage);
    })
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email existant.';
      default:
        return 'Une erreur est survenue, veuillez réessayer.';
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

  public navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  public navigateToHome(): void {
    this.router.navigate(['/car']);
  }

}
