import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap, RouterTestingModule } from '@angular/router/testing';

import { RoadmapComponent } from './roadmap.component';

describe('RoadmapComponent', () => {
  let component: RoadmapComponent;
  let fixture: ComponentFixture<RoadmapComponent>;

  beforeEach(async () => {
    const readSpy = jasmine.createSpy('read').and.resolveTo({
      data: [{ id: 'angular', title: 'Angular' }],
      hasMore: false,
      lastDoc: null
    });

    (window as any).Firebase = {
      read: readSpy,
      init: jasmine.createSpy(),
      write: jasmine.createSpy(),
      loginWithGoogle: jasmine.createSpy(),
      logout: jasmine.createSpy(),
      getUser: jasmine.createSpy(),
      log: jasmine.createSpy(),
      publish: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, RoadmapComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ id: 'angular' }) } }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(RoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the roadmap by route id', async () => {
    expect((window as any).Firebase.read).toHaveBeenCalledWith('roadmaps', 'angular');
  });
});
