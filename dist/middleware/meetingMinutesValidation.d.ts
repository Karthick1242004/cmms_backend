import { ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateMeetingMinutesId: ValidationChain[];
export declare const validateMeetingMinutesQuery: ValidationChain[];
export declare const validateCreateMeetingMinutes: ValidationChain[];
export declare const validateUpdateMeetingMinutes: ValidationChain[];
export declare const validateUpdateActionItem: ValidationChain[];
//# sourceMappingURL=meetingMinutesValidation.d.ts.map