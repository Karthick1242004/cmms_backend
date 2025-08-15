"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateProfile = void 0;
const express_validator_1 = require("express-validator");
exports.validateUpdateProfile = [
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^[\+]?[\d\s\-\(\)]{10,20}$/)
        .withMessage('Please enter a valid phone number')
        .trim(),
    (0, express_validator_1.body)('address')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Address cannot exceed 200 characters')
        .trim(),
    (0, express_validator_1.body)('city')
        .optional()
        .isLength({ max: 50 })
        .withMessage('City cannot exceed 50 characters')
        .trim(),
    (0, express_validator_1.body)('country')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Country cannot exceed 50 characters')
        .trim(),
    (0, express_validator_1.body)('jobTitle')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Job title cannot exceed 100 characters')
        .trim(),
    (0, express_validator_1.body)('bio')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Bio cannot exceed 1000 characters')
        .trim(),
    (0, express_validator_1.body)('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array'),
    (0, express_validator_1.body)('skills.*')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Each skill must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('certifications')
        .optional()
        .isArray()
        .withMessage('Certifications must be an array'),
    (0, express_validator_1.body)('certifications.*')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Each certification must be between 1 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('emergencyContact')
        .optional()
        .isObject()
        .withMessage('Emergency contact must be an object'),
    (0, express_validator_1.body)('emergencyContact.name')
        .optional({ values: 'null' })
        .if((value, { req }) => {
        const emergencyContact = req.body.emergencyContact;
        return emergencyContact && emergencyContact.name && emergencyContact.name.length > 0;
    })
        .isLength({ min: 1, max: 100 })
        .withMessage('Emergency contact name must be between 1 and 100 characters')
        .trim(),
    (0, express_validator_1.body)('emergencyContact.relationship')
        .optional({ values: 'null' })
        .if((value, { req }) => {
        const emergencyContact = req.body.emergencyContact;
        return emergencyContact && emergencyContact.relationship && emergencyContact.relationship.length > 0;
    })
        .isLength({ min: 1, max: 50 })
        .withMessage('Emergency contact relationship must be between 1 and 50 characters')
        .trim(),
    (0, express_validator_1.body)('emergencyContact.phone')
        .optional({ values: 'null' })
        .if((value, { req }) => {
        const emergencyContact = req.body.emergencyContact;
        return emergencyContact && emergencyContact.phone && emergencyContact.phone.length > 0;
    })
        .matches(/^[\+]?[\d\s\-\(\)]{10,20}$/)
        .withMessage('Emergency contact phone must be a valid phone number')
        .trim(),
];
