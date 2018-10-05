import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideocallComponent } from './videocall.component';

describe('VideocallComponent', () => {
  let component: VideocallComponent;
  let fixture: ComponentFixture<VideocallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideocallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideocallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
