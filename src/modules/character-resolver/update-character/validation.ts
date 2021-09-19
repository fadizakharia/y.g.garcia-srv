import * as yup from "yup";

export const updateCharacterValidator = yup.object().shape({
  id: yup.string().uuid("Invalid Id"),

  category: yup.string().optional(),

  name: yup.string().optional().min(3),

  gender: yup.string().optional().oneOf(["male", "female"]),

  color: yup.string().optional().min(2).max(255),

  ethnicity: yup.string().optional().min(2).max(255),

  bio: yup.string().optional().min(50),
});
