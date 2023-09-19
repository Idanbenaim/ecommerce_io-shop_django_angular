// app.module.ts
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistsComponent } from './components/artists/artists.component';

import { MatdesComponent } from './components/matdes/matdes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from 'src/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AlbumPageComponent } from './components/album-page/album-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArtistPageComponent } from './components/artist-page/artist-page.component';
// import { CartComponent } from './components/cart/cart.component';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { LoginComponent } from './components/login/login.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaypalComponent } from './components/paypal/paypal.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderService } from './services/order.service';
import { OrderItemService } from './services/order-item.service';
import { HomeComponent } from './components/home/home.component';
import { FiltersComponent } from './components/filters/filters.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AlbumRatingComponent } from './components/album-rating/album-rating.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AlbumsComponent,
    ArtistsComponent,
    AlbumPageComponent,
    ArtistPageComponent,
    CartPanelComponent,
    LoginComponent,
    CheckoutComponent,
    PaypalComponent,
    RegisterComponent,
    HomeComponent,
    FiltersComponent,
    MyOrdersComponent,
    AlbumRatingComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    YouTubePlayerModule
  ],
  providers: [OrderService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
