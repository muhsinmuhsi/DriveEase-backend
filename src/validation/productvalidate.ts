import Joi from "joi";

const carSchemajoi = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  brand: Joi.string().required(),
  seatingCapacity: Joi.number().integer().required(),
  pricePerDay: Joi.number().required(),
  fuelType: Joi.string().valid("Petrol", "Diesel", "Electric").required(),
  transmission: Joi.string().valid("Automatic", "Manual").required(),
  category:Joi.string().valid("Bike","EconomyCar","Luxury").required(),
  bookings: Joi.array()
    .items(
      Joi.object({
        pickupDate: Joi.date().iso().required(),
        dropoffDate: Joi.date().iso().required(),
      })
    )
    .default([]), 
});

export default carSchemajoi;
