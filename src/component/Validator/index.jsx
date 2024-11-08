// Import React if you want to use it later for any UI integration
//import React from 'react';
import { TOTAL_DIGITS_PHONE_NUMBER } from "../../constants/fomConstrant";
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(
            options.errorSelector
        );
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = `* ${errorMessage} *`;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // Khi submit form

        formElement.onsubmit = async function (e) { // Add 'async' here
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rules và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                var enableInputs = formElement.querySelectorAll('[name]');

                var formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'checkbox':
                            if (!input.matches(':checked')) {
                                values[input.name] = '';
                                return values;
                            }
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = [];
                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {});

                // If there's an options.onSubmit, call it
                if (typeof options.onSubmit === 'function') {
                    try {
                        await options.onSubmit(formValues); // Use 'await' to wait for the async onSubmit
                    } catch (error) {
                        //console.error('Error in onSubmit:', error);
                    }
                }
            }
        };

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }
            });
        });
    }
}

//-------Ràng buộc input user info--------

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Please enter this field';
        }
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Invalid email';
        }
    };
};

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `At least ${min} characters`;
        }
    };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'The value entered is incorrect';
        }
    };
};

Validator.isValidDate = function (selector, type, message) {
    return {
        selector: selector,
        test: function (value) {
            if (type === "create") {
                if (!value) {
                    return message || 'Invalid date';
                }
            }
            const selectedDate = new Date(value);
            const today = new Date();

            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            const minYear = 1900;
            const selectedYear = selectedDate.getFullYear();
            const currentYear = today.getFullYear();

            if (selectedYear < minYear || selectedYear > currentYear) {
                return message || `Year must be within range ${minYear}-${currentYear}`;
            }

            if (selectedDate > today) {
                return message || 'Date cannot be in the future';
            }

            return undefined;
        }
    };
};

Validator.isPhoneNumber = function (selector, message, TOTAL_DIGITS_PHONE_NUMBER) {
    return {
        selector: selector,
        test: function (value) {
            if (value.charAt(0) !== '0') {
                return 'Must start at 0';
            }
            const phoneRegex = new RegExp(`^0\\d{${TOTAL_DIGITS_PHONE_NUMBER - 1}}$`);
            return phoneRegex.test(value) ? undefined : message || `Must have ${TOTAL_DIGITS_PHONE_NUMBER} digits`;
        }
    };
};

//---------------------------------------------------------------------------

//-----------------------Ràng buộc update user info--------------------------

Validator.updateFullName = function (selector, getFullName, message) {
    return {
        selector: selector,
        test: function (value) {
            // Get the current full name value
            const currentFullName = getFullName;

            // Check if the value is empty or unchanged
            if (value === currentFullName) {
                return undefined; // Return the current value
            }
            // Regex for valid full name
            const nameRegex = /^[a-zA-Z\s]+$/;

            // Validate the new value
            return nameRegex.test(value) ? undefined : message || 'Invalid full name';
        }
    };
};


Validator.updateDateOfBirth = function (selector, getDateOfBirthValue, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value === getDateOfBirthValue) {
                return undefined;
            }
            // Gọi lại hàm xác thực ngày tháng nếu người dùng thay đổi giá trị ngày
            return Validator.isValidDate(selector, message).test(value);
        }
    };
};


Validator.updateEmail = function (selector, getEmailValue, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value === getEmailValue) {
                return undefined;
            }
            return Validator.isEmail(selector, message).test(value);
        }
    };
};

Validator.updatePhoneNumber = function (selector, getPhoneNumberValue, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value === getPhoneNumberValue) {
                return undefined;
            }
            return Validator.isPhoneNumber(selector, message, TOTAL_DIGITS_PHONE_NUMBER).test(value);
        }
    };
};

Validator.updatePassword = function (selector, getPasswordValue, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value === getPasswordValue()) {
                return undefined;
            }
            return Validator.minLength(selector, 8, message).test(value);
        }
    };
};

Validator.updateConfirmPassword = function (selector, getConfirmPasswordValue, message) {
    return {
        selector: selector,
        test: function (value) {
            if (value === getConfirmPasswordValue()) {
                return undefined;
            }
            return Validator.isConfirmed(selector, getPasswordValue, message).test(value);
        }
    };
};

//--------------------------------Change password----------------------------

//---------------------------------------------------------------------------
export default Validator;
