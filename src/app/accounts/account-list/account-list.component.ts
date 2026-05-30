import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Account } from '../../models/models';
@Component({standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./account-list.component.html'})
export class AccountListComponent implements OnInit{
 accounts:any[]=[]; currencies:any[]=[]; accountTypes:any[]=[]; accountGroups:any[]=[]; frequencies:any[]=[]; loanTypes:any[]=[];
 form:Account=this.empty();
 constructor(private api:ApiService){}
 ngOnInit(){this.load();['currencies','account-types','account-groups','frequencies','loan-types'].forEach(x=>this.api.master(x).subscribe((r:any)=>{(this as any)[x.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=r;}));}
 empty():Account{return {id:0,name:'',accountTypeId:1,isLoan:false,openingBalance:0,currencyId:1,isActive:true,planBudget:false,setAlerts:false};}
 load(){this.api.getAccounts().subscribe(r=>this.accounts=r)}
 edit(a:any){this.form={...a};}
 save(){this.api.saveAccount(this.form).subscribe(()=>{this.form=this.empty();this.load();});}
 delete(id:number){if(confirm('Delete this account?')) this.api.deleteAccount(id).subscribe(()=>this.load());}
}
