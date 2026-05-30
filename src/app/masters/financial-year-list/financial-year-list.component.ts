import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FinancialYear } from '../../models/models';

@Component({standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./financial-year-list.component.html'})
export class FinancialYearListComponent implements OnInit{
 items:FinancialYear[]=[]; form:FinancialYear=this.empty();
 constructor(private api:ApiService){}
 ngOnInit(){this.load();}
 empty():FinancialYear{return {id:0,name:'',startDate:'',endDate:'',isActive:true};}
 toDateInput(v?:string){return v ? v.substring(0,10) : '';}
 load(){this.api.master('financial-years').subscribe(r=>this.items=r.map(x=>({...x,startDate:this.toDateInput(x.startDate),endDate:this.toDateInput(x.endDate)})));}
 edit(x:FinancialYear){this.form={...x,startDate:this.toDateInput(x.startDate),endDate:this.toDateInput(x.endDate)};}
 save(){this.api.saveMaster('financial-years',this.form).subscribe(()=>{this.form=this.empty();this.load();});}
 delete(id:number){if(confirm('Delete this financial year?')) this.api.deleteMaster('financial-years',id).subscribe(()=>this.load());}
}
