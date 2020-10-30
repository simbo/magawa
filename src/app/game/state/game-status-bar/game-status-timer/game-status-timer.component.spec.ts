import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusTimerComponent } from './game-status-timer.component';

describe('GameStatusTimerComponent', () => {
  let component: GameStatusTimerComponent;
  let fixture: ComponentFixture<GameStatusTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatusTimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
