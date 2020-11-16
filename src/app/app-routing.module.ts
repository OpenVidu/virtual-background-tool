import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinalComponent } from './components/final/final.component';
import { FormComponent } from './components/form/form.component';
import { PresentationComponent } from './components/presentation/presentation.component';
import { RecordingComponent } from './components/recording/recording.component';

const routes: Routes = [
  { path: '', component: PresentationComponent },
  { path: 'form', component: FormComponent },
  { path: ':recording', component: RecordingComponent },
  { path: ':end', component: FinalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
