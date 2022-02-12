import { Pipe, PipeTransform } from '@angular/core';
import { PaginationData } from '@ngneat/elf-pagination';
import { generatePages } from './contacts-data';

@Pipe({
  name: 'paginationControls',
})
export class PaginationControlsPipe implements PipeTransform {
  transform({ total, perPage }: PaginationData): number[] {
    return generatePages(total, perPage);
  }
}
