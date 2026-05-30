import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
@Component({standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./transaction-form.component.html'})
export class TransactionFormComponent implements OnInit{
 type='payment'; accounts:any[]=[]; currencies:any[]=[]; paymentModes:any[]=[]; transactions:any[]=[];
 form:any={accountId:null,paymentModeId:null,amount:0,currencyId:1,transactionDate:new Date().toISOString().substring(0,10),description:'',referenceNo:''};
 constructor(private api:ApiService, private route:ActivatedRoute){}
 ngOnInit(){this.route.data.subscribe(d=>this.type=d['type']);this.api.getAccounts().subscribe(r=>this.accounts=r);this.api.master('currencies').subscribe(r=>this.currencies=r);this.api.master('payment-modes').subscribe(r=>this.paymentModes=r);this.load();}
 load(){this.api.transactions().subscribe(r=>this.transactions=r)}
 save(){const call=this.type==='payment'?this.api.savePayment(this.form):this.api.saveReceipt(this.form);call.subscribe(()=>{this.form.amount=0;this.form.description='';this.form.referenceNo='';this.load();});}
}
