import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatusNewComponent } from './game-status-new.component';


describe('GameStatusNewComponent', () => {

  let component: GameStatusNewComponent;
  let fixture: ComponentFixture<GameStatusNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameStatusNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStatusNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
