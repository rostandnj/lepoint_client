import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantManagementComponent } from './restaurant-management.component';

describe('RestaurantManagementComponent', () => {
  let component: RestaurantManagementComponent;
  let fixture: ComponentFixture<RestaurantManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
