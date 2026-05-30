import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
@Component({standalone:true, imports:[RouterOutlet,RouterLink,RouterLinkActive], templateUrl:'./layout.component.html', styleUrl:'./layout.component.scss'})
export class LayoutComponent{ fullName=localStorage.getItem('fullName')||'User'; constructor(public auth:AuthService){} }
