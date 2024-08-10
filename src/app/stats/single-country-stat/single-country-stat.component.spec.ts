import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCountryStatComponent } from './single-country-stat.component';

describe('SingleCountryStatComponent', () => {
  let component: SingleCountryStatComponent;
  let fixture: ComponentFixture<SingleCountryStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleCountryStatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCountryStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
