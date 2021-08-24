import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CocanComponent } from './cocan.component';

describe('CocanComponent', () => {
  let component: CocanComponent;
  let fixture: ComponentFixture<CocanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
