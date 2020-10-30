import { TestBed } from '@angular/core/testing';

import { GameOptionsService } from './game-options.service';

describe('GameOptionsService', () => {
  let service: GameOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
