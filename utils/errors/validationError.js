class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.field = field;
    }
}

function validate(errors) {
    if (errors) {
        throw new ValidationError(errors.message[0].message, errors.message[0].field);
    }
}

module.exports = validate;