import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectprogramComponent } from './selectprogram.component';

describe('SelectprogramComponent', () => {
  let component: SelectprogramComponent;
  let fixture: ComponentFixture<SelectprogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectprogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectprogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
