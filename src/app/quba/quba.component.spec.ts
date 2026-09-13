import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QubaComponent } from './quba.component';

describe('QubaComponent', () => {
  let component: QubaComponent;
  let fixture: ComponentFixture<QubaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QubaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QubaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
