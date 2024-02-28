import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpxDynamicTableComponent } from './npx-dynamic-table.component';

describe('NpxDynamicTableComponent', () => {
  let component: NpxDynamicTableComponent;
  let fixture: ComponentFixture<NpxDynamicTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpxDynamicTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NpxDynamicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
