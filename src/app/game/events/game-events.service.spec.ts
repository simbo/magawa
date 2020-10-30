import { TestBed } from '@angular/core/testing';

import { GameEventsService } from './game-events.service';


describe('GameEventsService', () => {
  let service: GameEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
