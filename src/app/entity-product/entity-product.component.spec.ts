import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityProductComponent } from './entity-product.component';

describe('EntityProductComponent', () => {
  let component: EntityProductComponent;
  let fixture: ComponentFixture<EntityProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
