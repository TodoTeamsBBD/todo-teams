import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Observable, throwError, of } from 'rxjs';
import { catchError, delay, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface DataItem {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
}

@Component({
  selector: 'app-participant-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatIconModule],
  templateUrl: './participant-search-bar.html',
  styleUrl: './participant-search-bar.css'
})
export class ParticipantSearchBar {
  searchForm: FormGroup;
  data: DataItem[] = [];
  filteredData: DataItem[] = [];
  loading = false;
  selectedItems: Set<number> = new Set();

  // Mock data for demonstration
  private mockData: DataItem[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', department: 'Sales', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', department: 'HR', status: 'Pending' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', department: 'Engineering', status: 'Active' },
    { id: 6, name: 'Diana Prince', email: 'diana.prince@example.com', department: 'Legal', status: 'Active' },
    { id: 7, name: 'Edward Norton', email: 'edward.norton@example.com', department: 'Finance', status: 'Inactive' },
    { id: 8, name: 'Fiona Green', email: 'fiona.green@example.com', department: 'Marketing', status: 'Pending' },
    { id: 9, name: 'George Miller', email: 'george.miller@example.com', department: 'IT', status: 'Active' },
    { id: 10, name: 'Helen Clark', email: 'helen.clark@example.com', department: 'Operations', status: 'Active' },
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit() {
    this.loadData();
    this.setupSearch();
  }

  setupSearch() {
    this.searchForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filterData(searchTerm);
    });
  }

  loadData() {
    this.loading = true;
    // Simulate API call with mock data
    of(this.mockData).pipe(
      delay(800), // Simulate network delay
      catchError(this.handleError)
    ).subscribe({
      next: (data) => {
        this.data = data;
        this.filteredData = [...data];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  // Real API implementation (uncomment and modify as needed)
  /*
  loadDataFromAPI() {
    this.loading = true;
    this.http.get<DataItem[]>('https://your-api-endpoint.com/api/data')
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.filteredData = [...data];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.loading = false;
        }
      });
  }
  */

  filterData(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // NEW METHOD: Add selected members to team
  addSelectedMembersToTeam() {
    if (this.selectedItems.size === 0) {
      console.log('No members selected to add to team');
      alert('Please select members to add to the team');
      return;
    }

    // Get the selected member data
    const selectedMembers = this.data.filter(item =>
      this.selectedItems.has(item.id)
    );

    console.log(`Adding ${selectedMembers.length} new team members:`);

    // Log each person as being added to the team
    selectedMembers.forEach(member => {
      console.log(`✅ New team member added: ${member.name} (${member.email}) from ${member.department}`);
    });

    // Optional: Clear selections after adding
    this.selectedItems.clear();

    // Here you would typically make an API call to actually add them to the team
    /*
    this.http.post('https://your-api-endpoint.com/api/team/members', {
      memberIds: Array.from(this.selectedItems)
    }).subscribe({
      next: (response) => {
        console.log('Team members added successfully', response);
        this.selectedItems.clear();
      },
      error: (error) => console.error('Error adding team members:', error)
    });
    */
  }

  // Helper method to get selected members (useful for other operations)
  getSelectedMembers(): DataItem[] {
    return this.data.filter(item => this.selectedItems.has(item.id));
  }

  onAdd() {
    if (this.selectedItems.size === 0) {
      console.log('No people selected to add to team');
      alert('Please select people to add to the team');
      return;
    }

    // Create object of people to be added
    const selectedMembers = this.data.filter(item =>
      this.selectedItems.has(item.id)
    );

    const teamAdditionData = {
      teamId: 'your-team-id', // Replace with actual team ID
      membersToAdd: selectedMembers,
      addedBy: 'current-user-id', // Replace with current user ID
      addedAt: new Date().toISOString(),
      totalMembers: selectedMembers.length
    };

    console.log('People to be added to team:', teamAdditionData);

    // Log each person being added
    selectedMembers.forEach(member => {
      console.log(`Adding new team member: ${member.name} (${member.email}) from ${member.department}`);
    });

    // Clear selections after creating the object
    this.selectedItems.clear();

    // For real API, use this:
    /*
    this.http.post('https://your-api-endpoint.com/api/team/add-members', teamAdditionData)
      .subscribe({
        next: (response) => {
          console.log('Team members added successfully:', response);
        },
        error: (error) => console.error('Error adding team members:', error)
      });
    */
  }

  toggleSelection(id: number) {
    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedItems.has(id);
  }

  toggleSelectAll() {
    if (this.selectedItems.size === this.filteredData.length) {
      this.selectedItems.clear();
    } else {
      this.selectedItems.clear();
      this.filteredData.forEach(item => this.selectedItems.add(item.id));
    }
  }

  isAllSelected(): boolean {
    return this.selectedItems.size === this.filteredData.length && this.filteredData.length > 0;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
