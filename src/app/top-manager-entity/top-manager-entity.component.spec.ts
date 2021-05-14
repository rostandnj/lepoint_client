import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopManagerEntityComponent } from './top-manager-entity.component';

describe('TopManagerEntityComponent', () => {
  let component: TopManagerEntityComponent;
  let fixture: ComponentFixture<TopManagerEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopManagerEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopManagerEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
