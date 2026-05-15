import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const phoneInputSchema = Joi.object({
  brand:     Joi.string().required(),
  model:     Joi.string().required(),
  storage:   Joi.string().required(),
  ram:       Joi.string().optional(),
  condition: Joi.string().valid('Excellent','Good','Fair','Poor').required(),
  pincode:   Joi.string().pattern(/^\d{6}$/).optional(),
});

export function validatePhoneInput(req: Request, res: Response, next: NextFunction) {
  const { error } = phoneInputSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}
