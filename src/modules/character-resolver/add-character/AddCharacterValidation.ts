import * as yup from "yup";

export const addCharacterValidator = yup.object().shape({
  name: yup.string(),
  gender: yup.string().oneOf(["male", "female"]),
  color: yup.string(),
  ethnicity: yup.string(),
  bio: yup.string().min(50),
  date_of_birth: yup.date(),
});
