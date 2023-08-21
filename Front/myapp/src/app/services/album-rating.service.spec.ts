import { TestBed } from '@angular/core/testing';

import { AlbumRatingService } from './album-rating.service';

describe('AlbumRatingService', () => {
  let service: AlbumRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
