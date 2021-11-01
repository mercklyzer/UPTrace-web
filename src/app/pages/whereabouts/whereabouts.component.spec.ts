import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhereaboutsComponent } from './whereabouts.component';

describe('WhereaboutsComponent', () => {
  let component: WhereaboutsComponent;
  let fixture: ComponentFixture<WhereaboutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhereaboutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhereaboutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
