import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgePipe } from './pipes/age.pipe';
import { DeletePromptComponent } from './components/delete-prompt/delete-prompt.component';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

const components = [DeletePromptComponent];
@NgModule({
  declarations: [AgePipe, components],
  imports: [CommonModule, NbButtonModule, NbCardModule],
  exports: [AgePipe, components],
})
export class SharedModule {}
