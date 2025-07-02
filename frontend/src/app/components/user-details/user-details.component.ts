import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userId: string = '';
  selectedUserId: string = '';
  user: any = null;

  date: string = '';
  entry: any = null;

  entries: any[] = [];
  filteredEntries: any[] = [];

  caloriesIn: number = 0;
  activityCaloriesOut: number = 0;
  netCalories: number = 0;
  bmr: number = 0;

  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.selectedUserId = this.userId;
    this.date = this.getTodayDate(); // initialize with today
    this.loadUser();
    this.loadEntries();
    this.fetchEntryData();
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadUser(): void {
    this.api.getUser(this.userId).subscribe(user => {
      this.user = user;
    });
  }

  loadEntries(): void {
    this.api.getAllEntriesForUser(this.userId).subscribe({
      next: (entries) => {
        this.entries = Array.isArray(entries) ? entries : [];
        this.filterEntries(); // filter on initial load
      },
      error: (err) => {
        console.clear();
        this.entries = [];
        this.filteredEntries = [];
        if (err.status !== 404) {
          console.error('❌ Failed to load entries:', err);
        }
      }
    });
  }

  filterEntries(): void {
    if (!this.date) {
      this.filteredEntries = [...this.entries];
      return;
    }

    const selected = new Date(this.date).toDateString();
    this.filteredEntries = this.entries.filter(entry =>
      new Date(entry.entry?.date).toDateString() === selected
    );
  }

  fetchEntryData(): void {
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
        error: () => {
          this.entry = null;
        }
      });
    }
  }

  onDateChange(): void {
    this.filterEntries();
    this.fetchEntryData();
  }

  viewEntry(date: string): void {
    this.router.navigate([`/users/${this.userId}/view-entry`], {
      queryParams: { date }
    });
  }

  openAddEntry(userId: string): void {
    this.selectedUserId = userId;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  refreshData(): void {
    this.loadUser();
    this.loadEntries();
    this.fetchEntryData();
  }
}
