import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateEmployeeComponent } from './dialog-update-employee.component';

describe('DialogUpdateEmployeeComponent', () => {
  let component: DialogUpdateEmployeeComponent;
  let fixture: ComponentFixture<DialogUpdateEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUpdateEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUpdateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
