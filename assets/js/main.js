const showPassword = document.querySelector('.show-password')
const Password = document.querySelector('.password-input')
const hidePassword = document.querySelector('.hide-password')
    // show password with icon
showPassword.addEventListener('click', () => {
        Password.setAttribute('type', 'text')
        hidePassword.classList.remove('d-none')
    })
    // hide password with icon
hidePassword.addEventListener('click', () => {
        Password.setAttribute('type', 'password')
        hidePassword.classList.add('d-none')
    })
    // constructor
const Validator = (options) => {
        // get parent input element
        const getParentElement = (element, selector) => {
            while (element.parentElement) {
                if (element.parentElement.matches(selector)) {
                    return element.parentElement
                }
                element = element.parentElement
            }
        }
        let selectorRule = {}; //save rules
        const formElement = document.querySelector(options.form)
            // remove error when focus input
        const removeError = (errorElement, inputElement) => {
                errorElement.innerText = ''
                getParentElement(inputElement, options.parentInputElement).classList.remove('invalid')
            }
            // event validate
        const validate = (inputElement, rule) => {
            const errorElement = getParentElement(inputElement, options.parentInputElement).querySelector('.form-message')
                // const errorMessage = rule.test(inputElement.value)
            let errorMessage
                // run each rule in turn
            const rules = selectorRule[rule.selector]
            for (let i = 0; i < rules.length; i++) {
                errorMessage = rules[i](inputElement.value)
                if (errorMessage) break
            }
            // show error
            if (errorMessage) {
                errorElement.innerText = errorMessage
                getParentElement(inputElement, options.parentInputElement).classList.add('invalid')
            } else {
                errorElement.innerText = ''
                getParentElement(inputElement, options.parentInputElement).classList.remove('invalid')

            }
            // call remove error function 
            inputElement.addEventListener('input', () => {
                    removeError(errorElement, inputElement)
                })
                // call remove error function 
            inputElement.addEventListener('focus', () => {
                removeError(errorElement, inputElement)
            })
            return !errorMessage
        }


        if (formElement) {
            formElement.onsubmit = (e) => {
                    e.preventDefault()

                    let isFormValid = true;

                    options.rules.forEach((rule) => {
                        const inputElement = formElement.querySelector(rule.selector)
                        let isValid = validate(inputElement, rule)
                        if (!isValid) {
                            isFormValid = false
                        }
                    })



                    if (isFormValid) {
                        if (typeof options.onsubmit === 'function') {
                            const enableInputs = formElement.querySelectorAll('[inputType]:not([disabled])')
                            const formValues = Array.from(enableInputs).reduce((values, input) => {
                                values[input.name] = input.value
                                return values
                            }, {})

                            options.onsubmit(formValues)
                        }
                    }
                }
                // loop and get all rules
            options.rules.forEach((rule) => {
                // get All Rules
                if (Array.isArray(selectorRule[rule.selector])) {
                    selectorRule[rule.selector].push(rule.test)
                } else {
                    selectorRule[rule.selector] = [rule.test]
                }
                // get input element
                const inputElement = formElement.querySelector(rule.selector)
                    // event when blur input
                if (inputElement) {
                    inputElement.addEventListener('blur', () => {
                        validate(inputElement, rule)
                    })
                }
            })
        }
    }
    // check if input is empty
Validator.isRequired = (selector, message) => {
        return {
            selector: selector,
            test: (value) => {
                return value.trim() ? undefined : message || 'Please Fill Out this Field.'
            }
        }
    }
    // password required minimum 8 characters
Validator.isRequiredPassword = (selector) => {
        return {
            selector: selector,
            test: (value) => {
                if (!value) {
                    return Validator.isRequired(selector).test(value)
                } else {
                    return value.length >= 8 ? undefined : 'This Field is Required Minimum 8 characters'
                }
            }
        }
    }
    // format email
Validator.isEmail = (selector) => {
    return {
        selector: selector,
        test: (value) => {
            if (!value) {
                return Validator.isRequired(selector).test(value)
            } else {
                const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return emailRegex.test(value) ? undefined : 'This field needs to be filled in with local-part@domain.'
            }
        }
    }
}