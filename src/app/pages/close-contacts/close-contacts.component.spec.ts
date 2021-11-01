import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseContactsComponent } from './close-contacts.component';

describe('CloseContactsComponent', () => {
  let component: CloseContactsComponent;
  let fixture: ComponentFixture<CloseContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseContactsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
