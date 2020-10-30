import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusFlagsComponent } from './game-status-flags.component';


describe('GameStatusFlagsComponent', () => {

  let component: GameStatusFlagsComponent;
  let fixture: ComponentFixture<GameStatusFlagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatusFlagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
