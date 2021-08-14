import * as yup from "yup";

export const updateBookValidator = yup.object().shape({
  id: yup.string().optional(),
  body: yup.string().optional().min(25),
  header: yup.string().optional().min(5),
  status: yup.number().optional().min(0).max(2),
  subtitle: yup.string().optional().min(5),
  title: yup.string().optional().min(5).max(50),
  warning_message: yup.string().optional().min(5).max(50),
});
