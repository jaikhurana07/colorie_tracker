import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    name: '',
    weight: null,
    height: null,
    gender: '', 
    dob: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  registerUser() {
    this.api.addUser(this.user).subscribe(() => {
     
      this.user = { name: '', weight: null, height: null, gender: '', dob: '' };
      this.router.navigate(['/users']);
    });
  }
  
}
