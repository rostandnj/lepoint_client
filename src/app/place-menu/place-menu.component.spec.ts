import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceMenuComponent } from './place-menu.component';

describe('PlaceMenuComponent', () => {
  let component: PlaceMenuComponent;
  let fixture: ComponentFixture<PlaceMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
