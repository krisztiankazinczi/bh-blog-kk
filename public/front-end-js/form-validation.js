function validateForm(validationValues) {
  let errorObject = {}
  if (!comparePasswords(validationValues.pw, validationValues.pw_confirm)) return errorObject = {...errorObject, 'pw_error': 'Please use the same password in the password confirmation field as in password field was used'}

  for (let [key, value] of Object.entries(validationValues)) {

    if (!value) errorObject[`${key}`] = `This field is required`
    else { 
      const result = checkLength(value)
      if (result) errorObject[`${key}`] = `${result.errorMessage}`  
    } 
  }
  return errorObject;
}



function comparePasswords(pw, pw_confirm) {
  return pw === pw_confirm
}



function checkLength(value) {
  if (value.length < 5) return { 'errorMessage': 'This field requires minimum 5 characters' }
  return false
}