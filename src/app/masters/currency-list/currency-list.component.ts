import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Currency } from '../../models/models';

@Component({standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./currency-list.component.html'})
export class CurrencyListComponent implements OnInit{
 items:Currency[]=[]; form:Currency=this.empty();
 constructor(private api:ApiService){}
 ngOnInit(){this.load();}
 empty():Currency{return {id:0,code:'',name:'',symbol:'',isActive:true};}
 load(){this.api.master('currencies').subscribe(r=>this.items=r);}
 edit(x:Currency){this.form={...x};}
 save(){this.api.saveMaster('currencies',this.form).subscribe(()=>{this.form=this.empty();this.load();});}
 delete(id:number){if(confirm('Delete this currency?')) this.api.deleteMaster('currencies',id).subscribe(()=>this.load());}
}
