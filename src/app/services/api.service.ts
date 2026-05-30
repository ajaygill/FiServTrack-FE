import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../core/config';
import { Account, Transaction } from '../models/models';
@Injectable({providedIn:'root'})
export class ApiService{
 constructor(private http:HttpClient){}
 getAccounts(){return this.http.get<Account[]>(`${API_BASE_URL}/accounts`)}
 saveAccount(a:Account){return a.id ? this.http.put(`${API_BASE_URL}/accounts/${a.id}`,a) : this.http.post(`${API_BASE_URL}/accounts`,a)}
 deleteAccount(id:number){return this.http.delete(`${API_BASE_URL}/accounts/${id}`)}
 master(name:string){return this.http.get<any[]>(`${API_BASE_URL}/masters/${name}`)}
 saveMaster(name:string,item:any){return item.id ? this.http.put(`${API_BASE_URL}/masters/${name}/${item.id}`,item) : this.http.post(`${API_BASE_URL}/masters/${name}`,item)}
 deleteMaster(name:string,id:number){return this.http.delete(`${API_BASE_URL}/masters/${name}/${id}`)}
 transactions(){return this.http.get<any[]>(`${API_BASE_URL}/transactions`)}
 savePayment(t:Transaction){return this.http.post(`${API_BASE_URL}/transactions/payment`,t)}
 saveReceipt(t:Transaction){return this.http.post(`${API_BASE_URL}/transactions/receipt`,t)}
}
