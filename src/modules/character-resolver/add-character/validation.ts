import * as yup from "yup";

export const addCharacterValidator = yup.object().shape({
  name: yup.string().min(3),

  gender: yup.string().oneOf(["male", "female"]),

  color: yup.string().min(2).max(255),

  ethnicity: yup.string().min(2).max(255),

  bio: yup.string().min(50),

  date_of_birth: yup.string(),
});
