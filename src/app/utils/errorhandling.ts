import { FormGroup } from "@angular/forms";

export const getFormValidationErrors = (form: FormGroup):string[] => {
    let hasError = false
    let errorMessages:string[] = []

    Object.keys(form.controls).forEach(key => {
      let controlErrors: any = form.get(key)?.errors;
      
      if (controlErrors != null) {
        hasError = true
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ' + controlErrors[keyError]);
        //   this.isError = true

          let field = getKeyString(key)
          let errorMessage = getErrorMessage(key,keyError)


          errorMessages.push(field + ' ' + errorMessage)
        });
      }
    });
    
    return errorMessages
  }


export const getKeyString = (key:string):string => {
  if(key === 'email')          return 'Email'
  if(key === 'contact_num')    return 'Contact Number'
  if(key === 'department')     return 'Department'
  if(key === 'region')         return 'Region'
  if(key === 'province')       return 'Province'
  if(key === 'city')           return 'City'
  if(key === 'barangay')       return 'Barangay'

  return ''
}
  
export const getErrorMessage = (key:string, keyError:string):string => {
  if(keyError === 'required')   return ' is required.'
  if(keyError === 'pattern')   return ' should be in the format 09XXXXXXXXX.'

  return ''
}