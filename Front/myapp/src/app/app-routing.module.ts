// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './components/album-page/album-page.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistPageComponent } from './components/artist-page/artist-page.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatdesComponent } from './components/matdes/matdes.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: "home",component:HomeComponent },
  { path: "albums",component:AlbumsComponent },
  { path: "artists",component:ArtistsComponent },
  { path: "mat", component: MatdesComponent },
  { path: 'album/:id', component: AlbumPageComponent },
  { path: "artists/:id", component: ArtistPageComponent },
  { path: 'auth', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: MyOrdersComponent },
  { path: 'get_album_ratings/:id', component: AlbumPageComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect empty path to /home
  { path: '**', redirectTo: '/home' } // Redirect all other paths to /home as well

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
