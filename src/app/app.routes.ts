import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DiagramCreatorComponent } from './components/diagram-creator/diagram-creator.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserDiagramsComponent } from './components/user-diagrams/user-diagrams.component';

const ROUTES: Routes = [
    {path: '', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'main', component: WelcomeComponent},
    {path: 'createDiagram', component: DiagramCreatorComponent},
    {path: 'userDiagrams', component: UserDiagramsComponent},
    {path: 'createDiagram/:diagramName', component: DiagramCreatorComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule{}