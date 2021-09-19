import * as yup from "yup";

export const createBookValidator = yup.object().shape({
  body: yup.string().min(25),
  header: yup.string().min(5),
  status: yup.number().min(0).max(2),
  subtitle: yup.string().min(5),
  title: yup.string().min(5).max(50),
  warning_message: yup.string().optional().min(5).max(50),
});
