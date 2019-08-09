import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileRoutingModule } from './file-routing.module';
import { UploadComponent } from './upload/upload.component';
import { PreviewComponent } from './preview/preview.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ReactiveFormsModule } from '@angular/forms'
import { HttpServiceService } from '../shared/http-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [
    UploadComponent,
    PreviewComponent,
    PagenotfoundComponent
  ],
  imports: [
    CommonModule,
    FileRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot()
  ],
  exports: [
    UploadComponent,
    PreviewComponent,
    PagenotfoundComponent    
  ],
  providers:[HttpServiceService]
})
export class FileModule { }
