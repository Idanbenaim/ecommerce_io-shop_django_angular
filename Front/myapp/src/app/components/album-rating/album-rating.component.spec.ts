import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumRatingComponent } from './album-rating.component';

describe('AlbumRatingComponent', () => {
  let component: AlbumRatingComponent;
  let fixture: ComponentFixture<AlbumRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumRatingComponent]
    });
    fixture = TestBed.createComponent(AlbumRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
