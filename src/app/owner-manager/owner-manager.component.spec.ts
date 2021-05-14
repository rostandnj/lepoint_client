import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerManagerComponent } from './owner-manager.component';

describe('OwnerManagerComponent', () => {
  let component: OwnerManagerComponent;
  let fixture: ComponentFixture<OwnerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
