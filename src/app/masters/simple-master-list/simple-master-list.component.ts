import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NamedMaster } from '../../models/models';

@Component({standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./simple-master-list.component.html'})
export class SimpleMasterListComponent implements OnInit{
 items:NamedMaster[]=[]; form:NamedMaster=this.empty(); entity=''; title='';
 constructor(private api:ApiService,private route:ActivatedRoute){}
 ngOnInit(){this.entity=this.route.snapshot.data['entity'];this.title=this.route.snapshot.data['title'];this.load();}
 empty():NamedMaster{return {id:0,name:'',isActive:true};}
 load(){this.api.master(this.entity).subscribe(r=>this.items=r);}
 edit(x:NamedMaster){this.form={...x};}
 save(){this.api.saveMaster(this.entity,this.form).subscribe(()=>{this.form=this.empty();this.load();});}
 delete(id:number){if(confirm(`Delete this ${this.title.slice(0,-1).toLowerCase()}?`)) this.api.deleteMaster(this.entity,id).subscribe(()=>this.load());}
}
