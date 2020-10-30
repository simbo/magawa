import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusBarComponent } from './game-status-bar.component';


describe('GameStatusBarComponent', () => {

  let component: GameStatusBarComponent;
  let fixture: ComponentFixture<GameStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatusBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
