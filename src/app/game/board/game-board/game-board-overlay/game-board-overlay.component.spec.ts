import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardOverlayComponent } from './game-board-overlay.component';


describe('GameBoardOverlayComponent', () => {

  let component: GameBoardOverlayComponent;
  let fixture: ComponentFixture<GameBoardOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameBoardOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBoardOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
