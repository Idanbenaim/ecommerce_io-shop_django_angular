import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatdesComponent } from './matdes.component';

describe('MatdesComponent', () => {
  let component: MatdesComponent;
  let fixture: ComponentFixture<MatdesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatdesComponent]
    });
    fixture = TestBed.createComponent(MatdesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
