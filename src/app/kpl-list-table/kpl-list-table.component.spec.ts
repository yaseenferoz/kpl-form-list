import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KplListTableComponent } from './kpl-list-table.component';

describe('KplListTableComponent', () => {
  let component: KplListTableComponent;
  let fixture: ComponentFixture<KplListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KplListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KplListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
