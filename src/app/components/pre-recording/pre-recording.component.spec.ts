import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRecordingComponent } from './pre-recording.component';

describe('PreRecordingComponent', () => {
  let component: PreRecordingComponent;
  let fixture: ComponentFixture<PreRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreRecordingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
