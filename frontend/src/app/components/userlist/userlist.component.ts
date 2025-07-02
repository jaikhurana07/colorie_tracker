import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = false;

  showModal: boolean = false;
  selectedUserId: string = '';
  entryDate: string = new Date().toISOString().split('T')[0];
  activeTab: 'food' | 'activity' = 'food';

  // Food
  foodList: any[] = [];
  foodForm = {
    foodId: '',
    mealType: 'breakfast',
    foodGroup: '',
    serving: 1
  };
  selectedFoods: any[] = [];

  // Activity
  activityList: any[] = [];
  activityForm = {
    activityId: '',
    description: '',
    metValue: 1,
    durationInMinutes: 30
  };
  selectedActivities: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
    // this.api.getFoods().subscribe(data => this.foodList = data);
    // this.api.getActivities().subscribe(data => this.activityList = data);
  }


  

           // from API
filteredFoodList: any[] = [];    // filtered result
visibleFoodList: any[] = [];     // paged result
servingList: number[] = Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5); // e
foodScrollBatchSize = 10;
currentScrollIndex = 0;
foodSearchQuery = '';
loadingMore = false;
loadingServingMore: boolean = false;
showServingDropdown: boolean = false;
visibleServingList: number[] = [];
filteredServingList: number[] = [];
currentServingPage: number = 0;
servingScrollBatchSize: number = 10;
servingSearchQuery: string = '';



toggleServingDropdown(): void {
  this.showServingDropdown = !this.showServingDropdown;
  if (this.showServingDropdown) {
    this.filteredServingList = [...this.servingList]; // from existing servingList
    this.currentServingPage = 0;
    this.visibleServingList = [];
    this.loadMoreServings();
  }
}



filterServingList(): void {
  this.filteredServingList = this.servingList.filter(value =>
    value.toString().includes(this.servingSearchQuery)
  );
  this.currentServingPage = 0;
  this.visibleServingList = [];
  this.loadMoreServings();
}

onServingScroll(event: any): void {
  const threshold = 50;
  const position = event.target.scrollTop + event.target.clientHeight;
  const max = event.target.scrollHeight;

  if (max - position < threshold && !this.loadingServingMore) {
    this.loadingServingMore = true;
    setTimeout(() => this.loadMoreServings(), 300);
  }
}

loadMoreServings(): void {
  const start = this.currentServingPage * this.servingScrollBatchSize;
  const end = start + this.servingScrollBatchSize;
  const batch = this.filteredServingList.slice(start, end);
  this.visibleServingList = [...this.visibleServingList, ...batch];
  this.currentServingPage++;
  this.loadingServingMore = false;
}
selectServing(value: number): void {
  this.foodForm.serving = value;
  this.showServingDropdown = false;
}
filterFoodList(): void {
  this.filteredFoodList = this.foodList.filter(food =>
    food.name.toLowerCase().includes(this.foodSearchQuery.toLowerCase())
  );
  this.resetFoodDropdown();
}

resetFoodDropdown(): void {
  this.currentScrollIndex = 0;
  this.visibleFoodList = this.filteredFoodList.slice(0, this.foodScrollBatchSize);
}

onFoodScroll(event: any): void {
  const threshold = 40;
  const pos = event.target.scrollTop + event.target.clientHeight;
  const max = event.target.scrollHeight;

  if (max - pos < threshold && !this.loadingMore) {
    this.loadingMore = true;

    setTimeout(() => {
      this.currentScrollIndex += this.foodScrollBatchSize;
      const next = this.filteredFoodList.slice(
        this.currentScrollIndex,
        this.currentScrollIndex + this.foodScrollBatchSize
      );
      this.visibleFoodList = [...this.visibleFoodList, ...next];
      this.loadingMore = false;
    }, 300);
  }
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

  viewUser(userId: string): void {
    this.router.navigate(['/users', userId, 'details']);
  }

  


  resetForm(): void {
    this.entryDate = new Date().toISOString().split('T')[0];
    this.foodForm = { foodId: '', mealType: 'breakfast', foodGroup: '', serving: 1 };
    this.activityForm = { activityId: '', description: '', metValue: 1, durationInMinutes: 30 };
    this.selectedFoods = [];
    this.selectedActivities = [];
    this.activeTab = 'food';
  }

 

fetchActivitiesIfEmpty(): void {
  if (this.activityList.length === 0) {
    this.api.getActivities().subscribe(data => this.activityList = data);
  }
}

  addFood() {
    if (!this.foodForm.foodId) return alert('Please select a food');
    this.selectedFoods.push({ ...this.foodForm });
    this.foodForm = { foodId: '', mealType: 'breakfast', foodGroup: '', serving: 1 };
  }

  addActivity() {
    if (!this.activityForm.activityId) return alert('Please select an activity');
    this.selectedActivities.push({ ...this.activityForm });
    this.activityForm = { activityId: '', description: '', metValue: 1, durationInMinutes: 30 };
  }

  submitEntry() {
    const payload = {
      userId: this.selectedUserId,
      date: this.entryDate,
      foods: this.selectedFoods.map(f => ({
        food: f.foodId,
        time: f.mealType,
        portion: f.serving,
        foodGroup: f.foodGroup
      })),
      activities: this.selectedActivities.map(a => ({
        activity: a.activityId,
        description: a.description,
        metValue: a.metValue,
        durationInMinutes: a.durationInMinutes
      }))
    };

    this.api.createOrUpdateEntry(payload).subscribe(() => {
      alert('✅ Entry saved!');
      this.closeModal();
    });
  }
  closeModal(): void {
  this.showModal = false;
}


  openAddEntry(userId: string): void {
  this.selectedUserId = userId;
  this.showModal = true;
}

refreshData(): void {
  this.fetchUsers(); // Or fetch relevant data if needed
}

  deleteUser(userId: string): void {
    if (confirm('🗑️ Are you sure you want to delete this user?')) {
      this.api.deleteUser(userId).subscribe(() => {
        this.fetchUsers();
      });
    }
  }
}


