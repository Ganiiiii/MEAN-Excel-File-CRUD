import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpServiceService } from 'src/app/shared/http-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  file:File;
  arrayBuffer: any;
  ID;
  employee= new Array();
  manager =new Array();
  modalRef: BsModalRef;
  path;
  editEmployee:FormGroup;
  allData;
  curUser;
  disMngCode;
  empOrMan;
  curEmpCode;
  constructor(private fb:FormBuilder,private serve:HttpServiceService,private route:ActivatedRoute,private router:Router,private modalService: BsModalService) { }
  
  //To Open a modal when clicked on that button
  openModal(template: TemplateRef<any>,emp,no) 
  {
    //if no === '1' then we have to display modal for employees
    if(no === '1')
    {
      this.empOrMan=1;
      this.disMngCode=true;
      this.modalRef = this.modalService.show(template);
      this.curUser=emp;   
      this.editEmployee.patchValue({
      empCode:emp.emp_code,
      mngCode:emp.mng_code,
      fname:emp.empName,
      lname:emp.empLastName,
      email:emp.empEmail,
      empStatus:emp.empStatus
    })
    }
    //if no === '2' then we have to display modal for Managers
    if(no === '2')
    {
      this.empOrMan=2;
      this.disMngCode=false;
      this.modalRef = this.modalService.show(template);
      this.curUser=emp;   
      this.editEmployee.patchValue({
      empCode:emp.emp_code,
      mngCode:'',
      fname:emp.mngName,
      lname:emp.mngLastName,
      email:emp.mngEmail,
      empStatus:emp.mngStatus
    })
    }
  }

  ngOnInit()
  {
    this.editEmployee = this.fb.group({
      empCode:['',Validators.required],
      mngCode:[''],
      fname:['',Validators.required],
      lname:['',Validators.required],
      email:[''],
      empStatus:['']
    })
    this.ID= this.route.snapshot.paramMap.get('id');
    this.serve.getFile(this.ID)
    .subscribe((response)=>{
      console.log(response);
      this.allData=response;
    },error=>console.log(error));
  }

//when edit button is clicked
  onClick()
  {
    for(var i=0;i<this.allData.employees.length;i++)
    {
      //For the employee edit
      if(this.empOrMan===1)
      {
        if(this.curUser === this.allData.employees[i])
      {
        this.allData.employees[i].emp_code= this.editEmployee.get('empCode').value;
        this.allData.employees[i].mng_code= this.editEmployee.get('mngCode').value;
        this.allData.employees[i].empName= this.editEmployee.get('fname').value;
        this.allData.employees[i].empLastName= this.editEmployee.get('lname').value;
        this.allData.employees[i].empEmail= this.editEmployee.get('email').value;
        this.allData.employees[i].empStatus= this.editEmployee.get('empStatus').value;
      }
      }
      //For the manager edit 
      if(this.empOrMan===2)
      {
        if(this.curUser === this.allData.manager[i])
      {
        this.curEmpCode= this.allData.manager[i].emp_code;
        this.allData.manager[i].emp_code= this.editEmployee.get('empCode').value;
        if(this.curEmpCode !== this.allData.manager[i].emp_code)
        this.setMngCode(this.allData.manager[i].emp_code,this.curEmpCode);
        this.allData.manager[i].mngName= this.editEmployee.get('fname').value;
        this.allData.manager[i].mngLastName= this.editEmployee.get('lname').value;
        this.allData.manager[i].mngEmail= this.editEmployee.get('email').value;
        this.allData.manager[i].mngStatus= this.editEmployee.get('empStatus').value;
      }
      }
    }
  }

  setMngCode(newCode,oldCode)
  {
    for(var i=0;i<this.allData.employees.length;i++)
    {
      if(this.allData.employees[i].mng_code === oldCode)
      {
        this.allData.employees[i].mng_code = newCode;
      }
    }

  }
  //When delete button clicked
  delR(i,no)
  {
    //For employee delete
    if(no==='1')
    {
      this.allData.employees.splice(i,1);
    }
    //For Manager delete
    if(no==='2')
    {
      if(this.allData.manager.length > 1)
      {
        var old=this.allData.manager[i].emp_code;
        this.allData.manager.splice(i,1);
        this.setMngCode(this.allData.manager[0].emp_code,old);
      }
      
    }
  }


  onSave()
  {
    let formdata = new FormData();
    formdata.append('managers', JSON.stringify(this.allData.manager));
    formdata.append('employees',JSON.stringify(this.allData.employees));
    this.serve.uploadFile(formdata)
    .subscribe((response)=>{console.log('response:',response);this.router.navigate(['../../upload'],{relativeTo:this.route})},(error)=>console.log(error));

  }
  onCancel()
  {
      this.serve.deleteFile(this.ID)
      .subscribe((response)=>{
        console.log(response);
      }),error=>console.log(error);
      this.router.navigate(['../../upload'],{relativeTo:this.route});
  }
  /*downLoadFile(data: any, type: string)
  {
    let blob = new Blob([data], { type: type});
    this.file = new File([blob], 'filename', {type: type, lastModified: Date.now()});
    console.log(this.file);
         
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file)
      fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          console.log('File Data:',XLSX.utils.sheet_to_json(worksheet,{raw:true}));
        }
    }*/
  
}
