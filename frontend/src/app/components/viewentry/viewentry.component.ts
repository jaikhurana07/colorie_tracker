import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-view-entry',
  templateUrl: './viewentry.component.html',
  styleUrls: ['./viewentry.component.scss']
})
export class ViewEntryComponent implements OnInit {
  userId!: string;
  date!: string;
  
  user: any;

  selectedDate: string = new Date().toISOString().split('T')[0]; // default today
entry: any = null;

  caloriesIn: number = 0;
  activityCaloriesOut: number = 0;
  bmr: number = 0;
  netCalories: number = 0;

  users: any[] = [];
  isLoading = false;
  showModal: boolean = false;
  selectedUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!;

    this.date = this.route.snapshot.queryParamMap.get('date')!;

    this.fetchEntryData();
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
  refreshData(): void {
  this.fetchUsers(); // Or fetch relevant data if needed
}

 fetchUsers(): void {
    this.isLoading = true;
    this.api.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load users:', err);
        this.isLoading = false;
      },
    });
  }


  onDateChange(): void {
  this.fetchEntryByDate();
}

fetchEntryByDate(): void {
  if (!this.selectedDate || !this.userId) return;

  this.api.getEntryByDate(this.userId, this.selectedDate).subscribe({
    next: (res: any) => {
      this.entry = res.entry || null;
      this.caloriesIn = res.caloriesIn || 0;
      this.activityCaloriesOut = res.activityCaloriesOut || 0;
      this.bmr = res.bmr || 0;
      this.netCalories = res.netCalories || 0;
    },
    error: (err) => {
      console.error('❌ Error fetching entry:', err);
      this.entry = null;
    }
  });
}
  closeModal(): void {
  this.showModal = false;
}

 fetchEntryData(): void {
    this.entry = null; // reset before fetching

    if (this.userId && this.date) {
      this.api.getEntryByDate(this.userId, this.date).subscribe({
        next: (res: any) => {
          if (res.entry) {
            this.entry = res.entry;
            this.user = res.entry.user;
            this.caloriesIn = res.caloriesIn;
            this.activityCaloriesOut = res.activityCaloriesOut;
            this.bmr = res.bmr;
            this.netCalories = res.netCalories;
          } else {
            this.entry = null;
          }
        },
        error: (err) => {
          console.error('❌ Failed to load entry:', err);
          this.entry = null;
        }
      });
    }
  }
 

openAddEntry(userId: string): void {
  this.selectedUserId = userId;
  this.showModal = true;
}


}

