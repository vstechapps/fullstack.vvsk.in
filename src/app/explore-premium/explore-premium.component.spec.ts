import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePremiumComponent } from './explore-premium.component';

describe('ExplorePremiumComponent', () => {
  let component: ExplorePremiumComponent;
  let fixture: ComponentFixture<ExplorePremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorePremiumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorePremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
