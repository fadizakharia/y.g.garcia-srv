import * as yup from "yup";
export const idValidation = yup.string().uuid("not a valid id!");
