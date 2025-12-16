import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiinterviewComponent } from './aiinterview.component';

describe('AiinterviewComponent', () => {
  let component: AiinterviewComponent;
  let fixture: ComponentFixture<AiinterviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiinterviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiinterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
