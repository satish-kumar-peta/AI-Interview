import { ComponentFixture, TestBed } from '@angular/core/testing';

import { adminScreensComponent } from './screens.component';

describe('ScreensComponent', () => {
  let component: adminScreensComponent;
  let fixture: ComponentFixture<adminScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ adminScreensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(adminScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
