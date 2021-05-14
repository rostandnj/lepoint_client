import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NightPharmacyComponent } from './night-pharmacy.component';

describe('NightPharmacyComponent', () => {
  let component: NightPharmacyComponent;
  let fixture: ComponentFixture<NightPharmacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NightPharmacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NightPharmacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
