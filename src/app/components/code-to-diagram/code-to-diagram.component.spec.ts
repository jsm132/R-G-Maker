import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeToDiagramComponent } from './code-to-diagram.component';

describe('CodeToDiagramComponent', () => {
  let component: CodeToDiagramComponent;
  let fixture: ComponentFixture<CodeToDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeToDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeToDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
