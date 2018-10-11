import { TestBed } from '@angular/core/testing';

import { SentimentService } from './sentiment.service';

describe('SentimentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SentimentService = TestBed.get(SentimentService);
    expect(service).toBeTruthy();
  });
});
