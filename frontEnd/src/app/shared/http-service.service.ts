import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  url="http://localhost:3000/routes";
  constructor(private http:HttpClient) { }

  uploadFile(formData)
  { 
    return this.http.post<any>(this.url,formData);
  }
  getFile(ID)
  {
   return this.http.get(this.url+'/'+ID);
  }
  deleteFile(ID)
  {
    return this.http.delete(this.url+'/'+ID);
  }
}


