import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/userlist/userlist.component';
import { ViewEntryComponent } from './components/viewentry/viewentry.component';
import { RegisterComponent } from './components/register/register.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

export const routes: Routes = [
    { path: '', component: RegisterComponent },
    { path: 'users', component: UserListComponent },
    { path: 'users/:id/details', component: UserDetailsComponent },
   { path: 'users/:userId/view-entry', component: ViewEntryComponent },

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
