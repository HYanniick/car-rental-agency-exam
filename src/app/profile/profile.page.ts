import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication/authentication.service';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class ProfilePage implements OnInit {
  public user = {
    fullName: '',
    email: '',
    phoneNumber: '',
  };

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().then((currentUser: any) => {
      if (currentUser?.uid) {
        this.authService.getUserDataByUid(currentUser.uid).then((userData) => {
          this.user = {
            fullName: userData.fullName || 'N/A',
            email: userData.email || 'N/A',
            phoneNumber: userData.phoneNumber || 'N/A',
          };
        }).catch((error) => {
          console.error('Error fetching user data:', error);
        });
      }
    }).catch((error) => {
      console.error('Error fetching current user:', error);
    });
  }

  public onLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }

  public navigateToHome(): void {
    this.router.navigate(['/car']);
  }
}
