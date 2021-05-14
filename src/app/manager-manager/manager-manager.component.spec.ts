import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerManagerComponent } from './manager-manager.component';

describe('ManagerManagerComponent', () => {
  let component: ManagerManagerComponent;
  let fixture: ComponentFixture<ManagerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
