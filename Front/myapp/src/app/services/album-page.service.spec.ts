import { TestBed } from '@angular/core/testing';

import { AlbumPageService } from './album-page.service';

describe('AlbumPageService', () => {
  let service: AlbumPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlbumPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
