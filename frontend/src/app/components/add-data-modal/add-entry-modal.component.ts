import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-entry-modal',
  templateUrl: './add-entry-modal.component.html',
  styleUrls: ['./add-entry-modal.component.scss'],
})
export class AddEntryModalComponent implements OnInit, OnChanges {
  @Input() userId: string = '';
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() entrySaved = new EventEmitter<void>();

  activeTab: 'food' | 'activity' = 'food';
  entryDate: string = new Date().toISOString().split('T')[0];

  foodList: any[] = [];
  activityList: any[] = [];

  foodSearchTerm: string = '';
  activitySearchTerm: string = '';

  foodForm = {
    foodId: '',
    mealType: 'breakfast',
    foodGroup: '',
    serving: 1,
  };

  activityForm = {
    activityId: '',
    description: '',
    metValue: 1,
    durationInMinutes: 30,
  };

  selectedFoods: any[] = [];
  selectedActivities: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && this.show) {
      this.resetForm();
    }
  }

  searchFoods() {
    if (this.foodSearchTerm.trim().length < 1) {
      this.foodList = [];
      return;
    }
    this.api.getFoods(this.foodSearchTerm).subscribe(data => {
      console.log('Food search results:', data);
      this.foodList = data.data;
    });
  }

  

  searchActivities() {
    if (this.activitySearchTerm.trim().length < 1) {
      this.activityList = [];
      return;
    }
    this.api.getActivities(this.activitySearchTerm).subscribe(data => {
      this.activityList = data.data;
    });
  }

  onFoodChange() {
    const food = this.foodList.find(f => f._id === this.foodForm.foodId);
    this.foodForm.foodGroup = food?.foodGroup || '';
  }

  onActivityChange() {
    const act = this.activityList.find(a => a._id === this.activityForm.activityId);
    this.activityForm.metValue = act?.metValue || 1;
  }

  addFood() {
    if (!this.foodForm.foodId) return;
    this.selectedFoods.push({ ...this.foodForm });
    this.foodForm = {
      foodId: '',
      mealType: 'breakfast',
      foodGroup: '',
      serving: 1,
    };
    this.foodList = [];
    this.foodSearchTerm = '';
  }

  addActivity() {
    if (!this.activityForm.activityId) return;
    this.selectedActivities.push({ ...this.activityForm });
    this.activityForm = {
      activityId: '',
      description: '',
      metValue: 1,
      durationInMinutes: 30,
    };
    this.activityList = [];
    this.activitySearchTerm = '';
  }

  submitEntry() {
    const payload = {
      userId: this.userId,
      
      date: this.entryDate,
      foods: this.selectedFoods.map(f => ({
        food: f.foodId,
        time: f.mealType,
        portion: f.serving,
        foodGroup: f.foodGroup,
      })),
      activities: this.selectedActivities.map(a => ({
        activity: a.activityId,
        description: a.description,
        metValue: a.metValue,
        durationInMinutes: a.durationInMinutes,
      })),
    };
   console.log('userId:', this.userId);
    this.api.createOrUpdateEntry(payload).subscribe(() => {
      alert('✅ Entry saved!');
      this.closeModal();
      this.entrySaved.emit();
    });
  }

  closeModal() {
    this.show = false;
    this.resetForm();
    this.close.emit();
  }

  resetForm() {
    this.entryDate = new Date().toISOString().split('T')[0];
    this.foodForm = {
      foodId: '',
      mealType: 'breakfast',
      foodGroup: '',
      serving: 1,
    };
    this.activityForm = {
      activityId: '',
      description: '',
      metValue: 1,
      durationInMinutes: 30,
    };
    this.selectedFoods = [];
    this.selectedActivities = [];
    this.activeTab = 'food';
    this.foodSearchTerm = '';
    this.activitySearchTerm = '';
    this.foodList = [];
    this.activityList = [];
  }
}

