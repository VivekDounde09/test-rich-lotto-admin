import * as Yup from 'yup';
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{3,3}$/i;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[~!@#$%^&*()/_=+[\]{}|;:,.<>?-])(?=.*[0-9])(?=.*[a-z]).{8,40}$/;

export const registrationValidationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, 'Please enter valid email')
    .required('Email is Required for OTP**'),
});

export const signupvalidationSchema = Yup.object({
  firstname: Yup.string()
    .required('Required')
    .min(3, 'Minimum 3 characters is required'),
  lastname: Yup.string()
    .required('Required')
    .min(3, 'Minimum 3 characters is required'),
  userName: Yup.string()
    .required('Required')
    .min(3, 'Minimum 3 characters is required'),
  country: Yup.string().required('Required'),
  email: Yup.string()
    .matches(emailRegex, 'Please enter valid email')
    .required('Required'),
  password: Yup.string()
    .required('Please enter password')
    .matches(
      passwordRegex,
      'Only accept One Uppercase and atleast one special characters and numbers',
    )
    .min(8, 'Minimum 8 characters is required.'),
  feeCheckbox: Yup.boolean().required('Required'),
  checkboxAge: Yup.boolean().required('User Must Be 18+'),
  checkboxTerms: Yup.boolean().required('Please Accept T&C'),
  emailVerificationCode: Yup.string()
    .required('Required')
    .min(6, 'please enter otp'),
});

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, 'Please enter valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Only accept One Uppercase and atleast one special characters and numbers',
    ),
});

export const poolCreationSchema = Yup.object({
  entryFees: Yup.string().required('Required'),
  // hours: Yup.string().required('Required'),
  // minutes: Yup.string().required('Required'),
  firstNumber: Yup.string().required('Required'),
  lastNumber: Yup.string().required('Required'),
});
export const passwordValidationSchema = Yup.object({
  oldPassword: Yup.string().required('Please enter password.'),
  newPassword: Yup.string().required('Please enter password.'),
  confirmPassword: Yup.string()
    .required('Please retype your password.')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export const profileValidationSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('First Name is required')
    .matches(/^[a-zA-Z]+$/, 'First Name must contain only letters'),
  lastname: Yup.string()
    .required('Last Name is required')
    .matches(/^[a-zA-Z]+$/, 'Last Name must contain only letters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
});
