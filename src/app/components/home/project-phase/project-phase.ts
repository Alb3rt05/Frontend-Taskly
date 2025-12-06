import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProjectPhase } from '../../../models/projectPhase';

@Component({
  selector: 'app-project-phase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-phase.html',
  styleUrl: './project-phase.css',
})
export class PhaseCard {
  @Input() phase!: ProjectPhase;                    // Project Phase da visualizzare
  @Input() active: boolean = false;
}
