const { body } = require("express-validator");

exports.empValidation = [
    body("name")
        .not()
        .isEmpty()
        .withMessage('Name is  required'),

    body("email")
        .not()
        .isEmpty()
        .withMessage('email is  required'),
    
    body("departmentName")
    .not()
    .isEmpty()
    .withMessage( 'departmentname is required'),

    body("designationName")
    .not()
    .isEmpty()
    .withMessage('designationName is required'),

    body("gender")
    .not()
    .isEmpty()
    .withMessage( "gender field can't be empty"),

    body(" countryId")
    .not()
    .isEmpty()
    .withMessage( "countryId field can't be empty"),

    body( "stateId")
    .not()
    .isEmpty()
    .withMessage( "stateId field can't be empty"),

    body("cityId")
    .not()
    .isEmpty()
    .withMessage( "cityId field can't be empty"),

]

