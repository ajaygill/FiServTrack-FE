import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
@Component({standalone:true, imports:[FormsModule], templateUrl:'./login.component.html', styleUrl:'./login.component.scss'})
export class LoginComponent{
 userName='admin'; password='Admin@123'; error=''; loading=false;
 constructor(private auth:AuthService){}
 async login(){try{this.loading=true;this.error='';await this.auth.login(this.userName,this.password);}catch(e:any){this.error=e?.error?.error||'Login failed';}finally{this.loading=false;}}
}
