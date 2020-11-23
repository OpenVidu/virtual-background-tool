import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

import {Gender, Hair, Skin} from '../../interfaces/user-data';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  email = new FormControl('', [Validators.email]);
  accepted = false;
  showMessageError = false;
  showInfoError = false;
  gender: Gender;
  hair: Hair;
  skin: Skin;

  constructor(private router: Router, private dataSrv: DataService) { }

  ngOnInit(): void {
  }

  start() {
    if (!!this.gender &&  !!this.skin && !!this.hair){
      this.showInfoError = false;
      this.dataSrv.setData({gender: this.gender, hair: this.hair, skin: this.skin, email: this.email.value});
    }
    else {
      this.showInfoError = true;
      return;

    }

    if (this.accepted) {
      this.showMessageError = false;
      this.router.navigate(['prerecording']);

    } else {
      this.showMessageError = true;

    }
  }

  onCheckboxChange(change: MatCheckboxChange) {
    this.showMessageError = !change.checked;
  }
}
