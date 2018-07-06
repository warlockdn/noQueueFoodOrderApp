import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionListComponent } from './accordion-list';

@NgModule({
    declarations: [ AccordionListComponent ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  })
  export class AccordionModule {}