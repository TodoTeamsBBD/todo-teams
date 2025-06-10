import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { TeamService, PaginatedTeams, Team } from '../../services/teamservice';
import { MatDialog } from '@angular/material/dialog';
import { CreateTeamForm } from '../../components/create-team-form/create-team-form';
import { ParticipantSearchBar } from '../../components/participant-search-bar/participant-search-bar';


@Component({
  selector: 'app-access-administrator-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './access-administrator-page.html',
  styleUrls: ['./access-administrator-page.css']
})
export class AccessAdministratorPage implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'created_at'];
  dataSource = new MatTableDataSource<Team>([]);
  totalTeams = 0;
  pageSize = 10;
  currentPage = 0; // Start with 0 for MatPaginator

  // Remove ViewChild and AfterViewInit - we're handling pagination manually
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadTeams(this.currentPage + 1, this.pageSize); // Backend expects 1-based pages
  }

  loadTeams(page: number, pageSize: number) {
  console.log(`Loading teams - Page: ${page}, PageSize: ${pageSize}`);

  this.teamService.getTeams(page, pageSize).subscribe({
    next: (result: PaginatedTeams) => {
      this.dataSource.data = result.data;
      this.totalTeams = result.total;
    },
    error: (error) => {
      console.error('Failed to fetch teams', error);
    }
  });
}

  onItemClick(item: Team) {
      this.dialog.open(ParticipantSearchBar, {
            maxWidth: '90vw',
            autoFocus: true,
            data: item
          });
    }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex; // Keep 0-based for MatPaginator
    this.pageSize = event.pageSize;
    this.loadTeams(this.currentPage + 1, this.pageSize); // Convert to 1-based for backend
  }

  // Remove ngAfterViewInit - we don't need it for server-side pagination
}
