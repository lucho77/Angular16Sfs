import { Validators, FormControl } from '@angular/forms';
export class CustomValidators extends Validators {

    // create a static method for your validation
    static validateFecha(control: FormControl) {

      // first check if the control has a value
      if (control.value && control.value.length > 0) {


        // match the control value against the regular expression
        // if there are matches return an object, else return null.
        return null;
      } else {
        return null;
      }
  }
}
