import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpServiceService } from 'src/app/shared/http-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#4A1111';
  }
  uploadForm:FormGroup;
  file:File;
  fileLabel='Choose File...'
  constructor(private fb:FormBuilder,private serve:HttpServiceService,private elementRef: ElementRef,private router:Router,private route:ActivatedRoute) { }

  ngOnInit()
  {
   this.uploadForm = this.fb.group({
     selectedFile:['']
   }) 
  }

  onSubmit()
  {
    let formData= new FormData();
    formData.append('excelFile', this.file,this.file.name);
    this.serve.uploadFile(formData)
    .subscribe((response)=>{console.log('response:',response);this.router.navigate(['../preview',response.userFile._id],{relativeTo:this.route})},(error)=>console.log(error));
  }





onFileSelect(event)
{
  if(event.target.files.length>0)
  {
    this.file=event.target.files[0];
    this.fileLabel=this.file.name;
  }
}
}
