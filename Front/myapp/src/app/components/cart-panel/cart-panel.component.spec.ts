import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartPanelComponent } from './cart-panel.component';

describe('CartPanelComponent', () => {
  let component: CartPanelComponent;
  let fixture: ComponentFixture<CartPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartPanelComponent]
    });
    fixture = TestBed.createComponent(CartPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
