import { body } from 'express-validator';

export const validateUpdateProfile = [
  // Name validation (optional)
  body('name')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim(),

  // First name validation (optional)
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim(),

  // Last name validation (optional)
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim(),

  // Phone validation (optional)
  body('phone')
    .optional()
    .matches(/^[\+]?[\d\s\-\(\)]{10,20}$/)
    .withMessage('Please enter a valid phone number')
    .trim(),

  // Address validation (optional)
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot exceed 200 characters')
    .trim(),

  // City validation (optional)
  body('city')
    .optional()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters')
    .trim(),

  // Country validation (optional)
  body('country')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters')
    .trim(),

  // Job title validation (optional)
  body('jobTitle')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters')
    .trim(),

  // Bio validation (optional)
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio cannot exceed 1000 characters')
    .trim(),

  // Skills validation (optional)
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),

  body('skills.*')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters')
    .trim(),

  // Certifications validation (optional)
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array'),

  body('certifications.*')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each certification must be between 1 and 100 characters')
    .trim(),

  // Emergency contact validation (optional)
  body('emergencyContact')
    .optional()
    .custom((value) => {
      // Allow empty object or fully empty strings without failing validation
      if (!value) return true;
      if (typeof value !== 'object') {
        throw new Error('Emergency contact must be an object');
      }
      return true;
    }),

  body('emergencyContact.name')
    .optional({ values: 'null' })
    .if((value, { req }) => {
      const emergencyContact = req.body.emergencyContact;
      return emergencyContact && typeof emergencyContact.name === 'string' && emergencyContact.name.trim().length > 0;
    })
    .isLength({ min: 1, max: 100 })
    .withMessage('Emergency contact name must be between 1 and 100 characters')
    .trim(),

  body('emergencyContact.relationship')
    .optional({ values: 'null' })
    .if((value, { req }) => {
      const emergencyContact = req.body.emergencyContact;
      return emergencyContact && typeof emergencyContact.relationship === 'string' && emergencyContact.relationship.trim().length > 0;
    })
    .isLength({ min: 1, max: 50 })
    .withMessage('Emergency contact relationship must be between 1 and 50 characters')
    .trim(),

  body('emergencyContact.phone')
    .optional({ values: 'null' })
    .if((value, { req }) => {
      const emergencyContact = req.body.emergencyContact;
      return emergencyContact && typeof emergencyContact.phone === 'string' && emergencyContact.phone.trim().length > 0;
    })
    .matches(/^[\+]?[\d\s\-\(\)]{10,20}$/)
    .withMessage('Emergency contact phone must be a valid phone number')
    .trim(),
];

