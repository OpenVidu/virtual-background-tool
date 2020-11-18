import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordingData} from '../../interfaces/recording-data';


@Component({
  selector: 'app-pre-recording',
  templateUrl: './pre-recording.component.html',
  styleUrls: ['./pre-recording.component.css']
})
export class PreRecordingComponent implements OnInit {


  recordingData: RecordingData;


  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: RecordingData) => {
      this.recordingData = params;
		});
  }

  start() {
    this.router.navigate(['recording', this.recordingData]);
  }

}
