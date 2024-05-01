import { TestBed } from '@angular/core/testing';

import { ExpandTemplateService } from './expand-template.service';

describe('ExpandTemplateService', () => {
  let service: ExpandTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpandTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
