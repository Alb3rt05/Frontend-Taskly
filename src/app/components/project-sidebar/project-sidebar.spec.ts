import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSidebar } from './project-sidebar';

describe('ProjectSidebar', () => {
  let component: ProjectSidebar;
  let fixture: ComponentFixture<ProjectSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
