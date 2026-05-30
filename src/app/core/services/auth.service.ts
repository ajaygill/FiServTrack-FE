import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JSEncrypt } from 'jsencrypt';
import { API_BASE_URL } from '../config';
@Injectable({providedIn:'root'})
export class AuthService{
 constructor(private http:HttpClient, private router:Router){}
 async login(userName:string,password:string){
  const key:any = await this.http.get(`${API_BASE_URL}/auth/public-key`).toPromise();
  const enc = new JSEncrypt(); enc.setPublicKey(key.publicKeyXml);
  const payload = enc.encrypt(JSON.stringify({userName,password}));
  const res:any = await this.http.post(`${API_BASE_URL}/auth/login`, {payload}).toPromise();
  localStorage.setItem('token', res.token); localStorage.setItem('fullName', res.fullName); this.router.navigate(['/accounts']);
 }
 logout(){localStorage.clear();this.router.navigate(['/login']);}
}
