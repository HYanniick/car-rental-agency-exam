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
    role: 'User',
  };

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().then((currentUser: any) => {
      if (currentUser) {
        this.user = {
          fullName: currentUser.fullName || 'N/A',
          email: currentUser.email || 'N/A',
          phoneNumber: currentUser.phoneNumber || 'N/A',
          role: currentUser.role || 'User',
        };
      }
    }).catch((error) => {
      console.error('Error fetching user data:', error);
    });
  }

  public onLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  }
}
