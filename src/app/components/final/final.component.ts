import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-final',
  templateUrl: './final.component.html',
  styleUrls: ['./final.component.css']
})
export class FinalComponent implements OnInit {

  constructor(private router: Router, private dataSrv: DataService) { }

  ngOnInit(): void {
  }

  reset() {

    if (this.dataSrv.isDataSaved()) {
      return this.router.navigate(['recording']);

    }
    return this.router.navigate(['form']);
  }

}
