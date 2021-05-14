import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvertComponent } from './show-advert.component';

describe('ShowAdvertComponent', () => {
  let component: ShowAdvertComponent;
  let fixture: ComponentFixture<ShowAdvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAdvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
