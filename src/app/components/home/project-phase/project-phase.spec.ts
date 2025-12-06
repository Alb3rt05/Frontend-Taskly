import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseWithTasks } from './project-phase';

describe('PhaseWithTasks', () => {
  let component: PhaseWithTasks;
  let fixture: ComponentFixture<PhaseWithTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseWithTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseWithTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
