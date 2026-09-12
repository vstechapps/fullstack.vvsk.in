import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedRoadmapComponent } from './advanced-roadmap.component';

describe('AdvancedRoadmapComponent', () => {
  let component: AdvancedRoadmapComponent;
  let fixture: ComponentFixture<AdvancedRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedRoadmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
