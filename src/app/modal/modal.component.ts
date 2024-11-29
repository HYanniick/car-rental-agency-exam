import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
  ]
})
export class ModalComponent  implements OnInit {

  @Input() errorMessage: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit = () => {};

  dismiss() {
    this.modalController.dismiss();
  }

}
