import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PhaseWithTasks } from '../../../pages/home/home';

@Component({
  selector: 'app-project-phase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-phase.html',
  styleUrl: './project-phase.css',
})
export class PhaseCard {
  @Input() phase!: PhaseWithTasks;                    // Project Phase da visualizzare
  @Input() active: boolean = false;
  @Output() onDeletePhase = new EventEmitter<PhaseWithTasks>();
}
