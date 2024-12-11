export const ReasonTextVal = (values) => {
    const errors = {};
    if (!values) {
        errors.isValid = false;
        errors.reason = 'Reason for Rejection';
    } else if (values?.length < 3) {
        errors.isValid = false;
        errors.reason = 'Reason must be 3 characters or more';
    } else {
        errors.isValid = true;
        errors.reason = ''
    }
    return errors;
}