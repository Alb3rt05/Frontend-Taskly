import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContent } from './project-content';

describe('ProjectContent', () => {
  let component: ProjectContent;
  let fixture: ComponentFixture<ProjectContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
