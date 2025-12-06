import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardt } from './project-content';

describe('TaskCardt', () => {
  let component: TaskCardt;
  let fixture: ComponentFixture<TaskCardt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCardt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
