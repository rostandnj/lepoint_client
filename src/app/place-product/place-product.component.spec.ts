import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceProductComponent } from './place-product.component';

describe('PlaceProductComponent', () => {
  let component: PlaceProductComponent;
  let fixture: ComponentFixture<PlaceProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
