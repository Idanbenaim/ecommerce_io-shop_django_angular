import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AlbumPageComponent } from './album-page.component';
import { Album, AlbumPageService } from 'src/app/services/album-page.service';
import { CartService } from 'src/app/services/cart.service';
import { AlbumRatingService } from 'src/app/services/album-rating.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('AlbumPageComponent', () => {
  let component: AlbumPageComponent;
  let fixture: ComponentFixture<AlbumPageComponent>;
  let mockActivatedRoute: any;
  let mockAlbumPageService: any;
  let mockCartService: any;
  let mockAlbumRatingService: any;
  let mockDomSanitizer: any;

  const mockAlbum: Album = {
    id: 2,
    artist: { artist_name: 'Nirvana' },
    genre: 'Rock',
    album_title: 'In Utero',
    albumYear: 1993,
    description: 'In Utero is the third and final studio album...',
    price: 22.00,
    yt_link: '<iframe width="560" height="315" src="https://www.youtube.com/embed/PoV76tdQONU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
    songs_list: [
      'Serve the Servants', 'Scentless Apprentice', 'Heart-Shaped Box', 'Rape Me',
      'Frances Farmer Will Have Her Revenge on Seattle', 'Dumb', 'Very Ape', 'Milk It',
      'Pennyroyal Tea', 'Radio Friendly Unit Shifter', 'tourette\'s', 'All Apologies'
    ],
    album_cover: 'http://127.0.0.1:8000/images/static/images/In_Utero_Nirvana_album_cover.jpg',
    quantity: 1
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '2' // Simulate route parameter
        }
      }
    };

    mockAlbumPageService = {
      getAlbum: jasmine.createSpy('getAlbum').and.returnValue(of(mockAlbum))
    };

    mockCartService = {
      cartUpdated: {
        subscribe: jasmine.createSpy('subscribe')
      },
      getCart: jasmine.createSpy('getCart').and.returnValue([])
    };

    mockAlbumRatingService = {
      getAlbumRatings: jasmine.createSpy('getAlbumRatings').and.returnValue(of({ up_votes: 10, down_votes: 5 }))
    };

    mockDomSanitizer = {
      bypassSecurityTrustResourceUrl: jasmine.createSpy('bypassSecurityTrustResourceUrl')
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AlbumPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AlbumPageService, useValue: mockAlbumPageService },
        { provide: CartService, useValue: mockCartService },
        { provide: AlbumRatingService, useValue: mockAlbumRatingService },
        { provide: DomSanitizer, useValue: mockDomSanitizer }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch album details on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(mockAlbumPageService.getAlbum).toHaveBeenCalledWith(2);
    expect(component.album).toEqual(mockAlbum);
    expect(component.upVotes).toBe(10);
    expect(component.downVotes).toBe(5);
  }));

  it('should update quantity when cart is updated', fakeAsync(() => {
    mockCartService.getCart.and.returnValue([{ album: { id: 2 }, quantity: 3 }]);
    component.ngOnInit();
    tick();

    expect(component.quantity).toBe(3);
  }));


});


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { AlbumPageComponent } from './album-page.component';
// import { AlbumPageService } from 'src/app/services/album-page.service';
// import { CartService } from 'src/app/services/cart.service';
// import { AlbumRatingService } from 'src/app/services/album-rating.service';
// import { DomSanitizer } from '@angular/platform-browser';
// import { of } from 'rxjs';
// import { Album } from 'src/app/models/album';

// describe('AlbumPageComponent', () => {
//   let component: AlbumPageComponent;
//   let fixture: ComponentFixture<AlbumPageComponent>;

//   // Mock ActivatedRoute with a test value
//   const mockActivatedRoute = {
//     snapshot: { paramMap: { get: (param: string) => '2' } }
//   };

//   // Mock services and provide mock data
//   const mockAlbumPageService = {
//     getAlbum: () => of(mockAlbumData)
//   };

//   const mockCartService = {
//     cartUpdated: of()
//   };

//   const mockAlbumRatingService = {
//     getAlbumRatings: () => of({ up_votes: 10, down_votes: 5 })
//   };

//   const mockDomSanitizer = {
//     bypassSecurityTrustResourceUrl: () => ''
//   };

  // const mockAlbumData: Album = {
  //   id: 2,
  //   artist: { artist_name: 'Nirvana' },
  //   genre: 'Rock',
  //   album_title: 'In Utero',
  //   albumYear: 1993,
  //   description: 'In Utero is the third and final studio album...',
  //   price: 22.00,
  //   yt_link: '<iframe width="560" height="315" src="https://www.youtube.com/embed/PoV76tdQONU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  //   songs_list: [
  //     'Serve the Servants', 'Scentless Apprentice', 'Heart-Shaped Box', 'Rape Me',
  //     'Frances Farmer Will Have Her Revenge on Seattle', 'Dumb', 'Very Ape', 'Milk It',
  //     'Pennyroyal Tea', 'Radio Friendly Unit Shifter', 'tourette\'s', 'All Apologies'
  //   ],
  //   album_cover: 'http://127.0.0.1:8000/images/static/images/In_Utero_Nirvana_album_cover.jpg',
  //   quantity: 1
  // };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AlbumPageComponent],
//       providers: [
//         { provide: ActivatedRoute, useValue: mockActivatedRoute },
//         { provide: AlbumPageService, useValue: mockAlbumPageService },
//         { provide: CartService, useValue: mockCartService },
//         { provide: AlbumRatingService, useValue: mockAlbumRatingService },
//         { provide: DomSanitizer, useValue: mockDomSanitizer }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AlbumPageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize album data', () => {
//     expect(component.album).toEqual(mockAlbumData);
//   });

//   // Add more test cases as needed
// });



// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { Subject, of } from 'rxjs';
// import { AlbumPageComponent } from './album-page.component';
// import { AlbumPageService } from 'src/app/services/album-page.service';
// import { CartService } from 'src/app/services/cart.service';
// import { DomSanitizer } from '@angular/platform-browser';
// import { Album } from 'src/app/models/album';
// import { Artist } from 'src/app/models/artist';

// describe('AlbumPageComponent', () => {
//   let component: AlbumPageComponent;
//   let fixture: ComponentFixture<AlbumPageComponent>;

//   const mockAlbumPageService = jasmine.createSpyObj('AlbumPageService', ['getAlbum']);
//   const mockCartService = jasmine.createSpyObj('CartService', ['cartUpdated']);
//   // const mockDomSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AlbumPageComponent],
//       providers: [
//         { provide: AlbumPageService, useValue: mockAlbumPageService },
//         { provide: CartService, useValue: mockCartService },
//         // { provide: DomSanitizer, useValue: mockDomSanitizer }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AlbumPageComponent);
//     component = fixture.componentInstance;
//     mockAlbumPageService.getAlbum.and.returnValue(of(mockAlbumData));
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should subscribe to cartUpdated', () => {
//     component.ngOnInit();
//     expect(mockCartService.cartUpdated.subscribe).toHaveBeenCalled();
//   });

//   it('should set album data after initialization', () => {
//     expect(component.album).toEqual(mockAlbumData);
//   });

// });

// // Mock data
// const mockArtistData: Artist = {
//   id: 1,
//   artist_name: 'Nirvana',
// };

// const mockCartService = {
//   cartUpdated: new Subject<void>(),
// };

// const mockAlbumData: Album = {
//   id: 2,
//   artist: mockArtistData,
//   genre: 'Rock',
//   album_title: 'In Utero',
//   albumYear: 1993,
//   description: "In Utero...",
//   price: 22.0,
//   yt_link: 'https://www.youtube.com/embed/PoV76tdQONU',
//   songs_list: ['Serve the Servants', 'Scentless Apprentice'],
//   album_cover: 'http://127.0.0.1:8000/images/static/images/In_Utero_Nirvana_album_cover.jpg',
//   quantity: 1
// };


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { Subject, of } from 'rxjs';
// import { AlbumPageComponent } from './album-page.component';
// import { AlbumPageService } from 'src/app/services/album-page.service';
// import { CartService } from 'src/app/services/cart.service';
// import { AlbumRatingService } from 'src/app/services/album-rating.service';
// import { DomSanitizer } from '@angular/platform-browser';
// import { Album } from 'src/app/models/album';
// import { Artist } from 'src/app/models/artist';

// describe('AlbumPageComponent', () => {
//   let component: AlbumPageComponent;
//   let fixture: ComponentFixture<AlbumPageComponent>;

//   const mockActivatedRoute = {
//     snapshot: { paramMap: { get: () => '2' } } // Simulating route param value '2'
//   };

//   const mockAlbumPageService = jasmine.createSpyObj('AlbumPageService', ['getAlbum']);
//   const mockCartService = jasmine.createSpyObj('CartService', ['cartUpdated']);
//   const mockAlbumRatingService = jasmine.createSpyObj('AlbumRatingService', ['getAlbumRatings']);
//   const mockDomSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [AlbumPageComponent],
//       providers: [
//         { provide: ActivatedRoute, useValue: mockActivatedRoute },
//         { provide: AlbumPageService, useValue: mockAlbumPageService },
//         { provide: CartService, useValue: mockCartService },
//         { provide: AlbumRatingService, useValue: mockAlbumRatingService },
//         { provide: DomSanitizer, useValue: mockDomSanitizer }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AlbumPageComponent);
//     component = fixture.componentInstance;
//     mockAlbumPageService.getAlbum.and.returnValue(of(mockAlbumData)); // Assume you have mockAlbumData
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should subscribe to cartUpdated', () => {
//     // test the behavior when cartUpdated is triggered
//     const cartUpdateSpy = spyOn(mockCartService.cartUpdated, 'subscribe');
//     component.ngOnInit();
//     mockCartService.cartUpdated.next();
//     expect(cartUpdateSpy).toHaveBeenCalled();
//   });

// });

// // Mock data
// const mockArtistData: Artist = {
//   id: 1,
//   artist_name: 'Nirvana',
// };

// const mockCartService = {
//   cartUpdated: new Subject<void>(),
// };

// const mockAlbumData: Album = {
//   id: 2,
//   artist: mockArtistData,
//   genre: 'Rock',
//   album_title: 'In Utero',
//   albumYear: 1993,
//   description: "In Utero...",
//   price: 22.0,
//   yt_link: 'https://www.youtube.com/embed/PoV76tdQONU',
//   songs_list: ['Serve the Servants', 'Scentless Apprentice'],
//   album_cover: 'http://127.0.0.1:8000/images/static/images/In_Utero_Nirvana_album_cover.jpg',
//   quantity: 1
// };

