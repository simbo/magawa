import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusOptionsComponent } from './game-status-options.component';


describe('GameStatusOptionsComponent', () => {

  let component: GameStatusOptionsComponent;
  let fixture: ComponentFixture<GameStatusOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatusOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
