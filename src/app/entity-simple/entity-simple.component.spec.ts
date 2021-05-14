import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySimpleComponent } from './entity-simple.component';

describe('EntitySimpleComponent', () => {
  let component: EntitySimpleComponent;
  let fixture: ComponentFixture<EntitySimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitySimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
