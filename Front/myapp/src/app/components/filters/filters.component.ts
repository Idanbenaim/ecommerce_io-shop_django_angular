// filters.component.ts
import { Component, OnInit } from '@angular/core';
import { AlbumsService } from 'src/app/services/albums.service';
import { Genre } from 'src/app/models/genre';
import { FormControl } from '@angular/forms';
import { FiltersService } from 'src/app/services/filters.service';
import { devOnlyGuardedExpression } from '@angular/compiler';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  genres: Genre[] = []; // Define a property to store the list of genres.
  selectedGenres = new FormControl<string[]>([]); ///////////////////////////// Control the selected genres.

  decades = ['60s', '70s', '80s', '90s'];
  selectedDecades = new FormControl([]); // Control the selected decades.

  constructor(private filtersService: FiltersService) { }

  ngOnInit() {
    // Fetch the list of genres from your service.
    this.filtersService.getGenres().subscribe((genres: Genre[]) => { ///////////////////// : Genre[]
      this.genres = genres;
    });
  }

  onGenresSelectionChange() {
    this.filtersService.updateSelectedGenres(this.selectedGenres.value!);
  }

  // onDecadesSelectionChange() {
  //   this.filtersService.updateSelectedDecades(this.selectedDecades.value!);
  // }
  // onDecadesSelectionChange() {
  //   const formattedDecades = (this.selectedDecades.value ?? []).map((decade: string) => {
  //     const year = Number(decade.slice(0, 2));
  //     return `${year}0s`;
  //   });
  //   this.filtersService.updateSelectedDecades(formattedDecades);
  // }

  onDecadesSelectionChange() {
    const formattedDecades = this.selectedDecades.value?.map((decades: string) => {
      console.log(decades.slice(0, 1));
      return decades.slice(0, 1); // Get the first character of the selected decade ("60s" -> "6")
    });
    if (formattedDecades) {
      this.filtersService.updateSelectedDecades(formattedDecades);
    }
  }
  // onDecadesSelectionChange() {
  //   const selectedDecades = this.selectedDecades.value || [];

  //   // Filter and format the selected decades
  //   const formattedDecades = selectedDecades.map((decade: string) => {
  //     // Extract the first digit of the selected decade
  //     console.log(this.decades.slice(0, 1));
  //     const selectedDecadeDigit = decade.slice(0, 1);

  //     return Number(selectedDecadeDigit); // Convert it to a number
  //   });

  //   // Update the selected decades in the FiltersService
  //   this.filtersService.updateSelectedDecades(formattedDecades);
  // }

}
