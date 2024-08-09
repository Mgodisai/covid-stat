import { Directive } from '@angular/core';
import {
   NG_VALIDATORS,
   Validator,
   AbstractControl,
   ValidationErrors,
} from '@angular/forms';
import { passwordComplexityValidator } from './password-complexity.validator';

@Directive({
   selector: '[passwordComplexity]',
   providers: [
      {
         provide: NG_VALIDATORS,
         useExisting: PasswordComplexityDirective,
         multi: true,
      },
   ],
   standalone: true,
})
export class PasswordComplexityDirective implements Validator {
   validate(control: AbstractControl): ValidationErrors | null {
      return passwordComplexityValidator()(control);
   }
}
