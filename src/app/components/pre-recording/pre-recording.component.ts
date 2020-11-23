import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-recording',
  templateUrl: './pre-recording.component.html',
  styleUrls: ['./pre-recording.component.css']
})
export class PreRecordingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  start() {
    this.router.navigate(['recording']);
  }

}
