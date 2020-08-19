import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAssignedComponent } from './not-assigned.component';

describe('NotAssignedComponent', () => {
  let component: NotAssignedComponent;
  let fixture: ComponentFixture<NotAssignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAssignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
