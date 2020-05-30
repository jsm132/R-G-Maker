import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DiagramCreatorComponent } from './components/diagram-creator/diagram-creator.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserDiagramsComponent } from './components/user-diagrams/user-diagrams.component';
import { InformationComponent } from './components/information/information.component';
import { CodeToDiagramComponent } from './components/code-to-diagram/code-to-diagram.component';

const ROUTES: Routes = [
    {path: '', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'main', component: WelcomeComponent},
    {path: 'createDiagram', component: DiagramCreatorComponent},
    {path: 'userDiagrams', component: UserDiagramsComponent},
    {path: 'createDiagram/edit/:diagramName', component: DiagramCreatorComponent},
    {path: 'information', component: InformationComponent},
    {path: 'code-to-diagram', component: CodeToDiagramComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule{}