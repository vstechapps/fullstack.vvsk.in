import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiconComponent } from './cicon.component';

describe('CiconComponent', () => {
  let component: CiconComponent;
  let fixture: ComponentFixture<CiconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CiconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CiconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
