import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPhase } from './project-phase';

describe('ProjectPhase', () => {
  let component: ProjectPhase;
  let fixture: ComponentFixture<ProjectPhase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPhase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPhase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
