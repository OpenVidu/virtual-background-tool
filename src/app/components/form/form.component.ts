import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';

import {Gender, Hair, RecordingData, Skin} from '../../interfaces/recording-data';

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
  recordingData: RecordingData;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  start() {
    if (!!this.gender &&  !!this.skin && !!this.hair){
      this.showInfoError = false;
      this.recordingData = {gender: this.gender, hair: this.hair, skin: this.skin};
    }
    else {
      this.showInfoError = true;
      return;

    }

    if (this.accepted) {
      this.showMessageError = false;
      this.router.navigate(['prerecording', this.recordingData]);

    } else {
      this.showMessageError = true;

    }
  }

  onCheckboxChange(change: MatCheckboxChange) {
    this.showMessageError = !change.checked;
  }
}
