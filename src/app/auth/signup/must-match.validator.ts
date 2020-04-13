import { FormGroup } from '@angular/forms';

export function mustMatch(mainControlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const mainControl = formGroup.controls[mainControlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (mainControl.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
