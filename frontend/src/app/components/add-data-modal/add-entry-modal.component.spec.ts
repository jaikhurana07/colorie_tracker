import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntryModalComponent } from './add-entry-modal.component';

describe('AddDataModalComponent', () => {
  let component: AddEntryModalComponent;
  let fixture: ComponentFixture<AddEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEntryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
