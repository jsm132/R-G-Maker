import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDiagramsComponent } from './user-diagrams.component';

describe('UserDiagramsComponent', () => {
  let component: UserDiagramsComponent;
  let fixture: ComponentFixture<UserDiagramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDiagramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
