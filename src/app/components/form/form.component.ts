import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  email = new FormControl('', [Validators.email]);
  accepted = false;
  showMessageError = false;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  start() {
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
