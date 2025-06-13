import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/teamservice';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-team-stats',
  imports: [CommonModule, MatCardModule],
  templateUrl: './team-stats.html',
  styleUrls: ['./team-stats.css'],
})
export class TeamStats implements OnInit {
  teamId!: number;

  stats: {
    totalCount: number;
    completedCount: number;
    incompleteCount: number;
    avgTimeToComplete: number;
  } | null = null;

  error: string | null = null;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['teamId'];
      if (!id) {
        this.error = 'No team ID provided';
        return;
      }

      this.teamId = +id;
      this.fetchStats();
    });
  }

  fetchStats(): void {
    this.teamService.getStats(this.teamId).subscribe({
      next: (data) => {
        this.stats = {
          ...data,
          avgTimeToComplete: data.avgTimeToComplete / (1000 * 60 * 60 * 24),
        };
      },
      error: (err) => {
        this.error = 'Failed to load team stats';
        console.error(err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/to-do-list'], {
      queryParams: { teamId: this.teamId },
    });
  }
}
