import { Component, ViewChild, AfterViewInit,ViewEncapsulation  } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatMenuTrigger } from '@angular/material/menu';
import * as XLSX from 'xlsx';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-kpl-list-table',
  templateUrl: './kpl-list-table.component.html',
  styleUrls: ['./kpl-list-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class KplListTableComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'phone', 'village', 'playerType', 'photo', 'actions'];
  totalRecords: number = 0;
  selectedRecordId: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) { }
baseUrl='https://cric-be.onrender.com/api/forms'
  ngAfterViewInit(): void {
    this.getData(); // Move the initialization to ngAfterViewInit
  }
  exportToExcel(): void {
    // Define columns to export
    const columnsToExport = ['name', 'phone', 'villageName', 'playerType', 'photo'];

    // Filter data source to include only the selected columns
    const dataToExport = this.dataSource.filteredData.map(item =>
        columnsToExport.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {})
    );

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

    // Create a new workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'data.xlsx');
}


  getData(): void {
    this.http.get<any[]>(this.baseUrl)
      .subscribe({
        next: data => {
          if (data) {
            this.dataSource.data = data;
            this.totalRecords = this.dataSource.data.length;
            this.dataSource.paginator = this.paginator;
            this.dataSource.filterPredicate = (data: any, filter: string) => {
              const dataStr = Object.keys(data).map(key => data[key]).join(' ');
              return dataStr.toLowerCase().includes(filter);
            };
            this.dataSource.sortingDataAccessor = (item: any, property: string) => {
              switch(property) {
                case 'name': return item.name;
                case 'phone': return item.phone;
                case 'village': return item.villageName;
                case 'playerType': return item.playerType;
                default: return '';
              }
            };
          } else {
            console.error('Data received from API is not an array:', data);
          }
        },
        error: error => {
          console.error('Error fetching data from API:', error);
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Update totalRecords based on the length of the currently displayed data
    this.totalRecords = this.dataSource.filteredData.length;
  }

  confirmDelete(confirm: boolean): void {
    if (confirm) {
        this.http.delete<any[]>(`${this.baseUrl}/${this.selectedRecordId}`)
            .subscribe({
                next: data => {
                    console.log('Deleting record with id:', this.selectedRecordId);
                    // Filter out the deleted record from the data source
                    this.dataSource.data = this.dataSource.data.filter(item => item._id !== this.selectedRecordId);

                    // Update totalRecords
                    this.totalRecords = this.dataSource.data.length;

                    // Optionally, you can also refresh the paginator
                    if (this.paginator) {
                        this.cdr.detectChanges(); // Trigger change detection
                        this.paginator._changePageSize(this.paginator.pageSize); // Refresh paginator
                    }

                    // Reload data after deletion
                    this.getData(); // Call getData method to reload the table data
                }
            });
    }

    // Reset selectedRecordId
    this.selectedRecordId = '';
    // Close the menu
    this.menuTrigger.closeMenu();
}


  deleteRecord(id: string): void {
    // Set the selected record ID before opening the menu
    this.selectedRecordId = id;
    // Open the menu if it's initialized
    if (this.menuTrigger) {
      this.menuTrigger.openMenu();
    }
  }
}
