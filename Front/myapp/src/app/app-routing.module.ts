import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './components/album-page/album-page.component';
import { AlbumsComponent } from './components/albums/albums.component';
import { ArtistPageComponent } from './components/artist-page/artist-page.component';
import { ArtistsComponent } from './components/artists/artists.component';
import { MatdesComponent } from './components/matdes/matdes.component';

const routes: Routes = [
    { path: "albums",component:AlbumsComponent },
    { path: "artists",component:ArtistsComponent },
    { path: "mat", component: MatdesComponent },
    { path: 'album/:id', component: AlbumPageComponent },
    { path: "artists/:id", component: ArtistPageComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
