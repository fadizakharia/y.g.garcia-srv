import * as yup from "yup";
export const addCharacterToCategoryValidation = yup.object().shape({
  catId: yup.string().uuid(),
  charId: yup.string().uuid(),
});
