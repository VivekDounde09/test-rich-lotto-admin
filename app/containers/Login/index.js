import { isLoggedIn, postReq, setAuthCookie } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { signInValidationSchema } from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isYupError, parseYupError } from '@/utils/Yup';

const Login = () => {
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState({});
  const [setLock, isSetLock] = useState();
  const navigate = useNavigate();
  const lockFunction = () => {
    isSetLock(!setLock);
  };

  // const isDevelopment = process.env.NODE_ENV !== 'production';
  // const isProductionApp = process.env.APP_ENV === 'production';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({ ...formError, [name]: '' });
  };

  const handleSubmit = async (e) => {
    const toastId = toast.loading('Loading...');
    e.preventDefault();

    try {
      await signInValidationSchema.validate(form, {
        abortEarly: false,
      });

      const res = await postReq('/auth/login/admin', form);
      const { status, error } = res;
      console.log(res, 'res');

      if (status) {
        setAuthCookie();
        toast.success('Logged in');
        // navigate('/');
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        console.log(error);
      }
    }
    toast.dismiss(toastId);
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
    /* eslint-disable */
  }, []);
  return (
    <main className=" relative min-h-[100dvh] flex-center text-white overflow-hidden bg-[url('/public/images/login/background.png')]">
      <div className="absolute z-10 top-7 left-7   w-[100px] lg:w-[145px]">
        <img
          className="h-full w-full object-cover"
          src="/images/logo.png"
          alt=""
        />
      </div>

      <div className="scaling absolute  w-full  h-full bg-[url('/public/images/login/background.png')] md:bg-[url('/public/images/login/path.png')] bg-cover bg-center"></div>
      <div className=" absolute rounded-full lg:w-[55%] lg:h-[55%] h-[70%] w-[70%]    animate-spin-slow ">
        <img
          className="absolute top-0 animate-spin-slow-reverse-circle  right-0 md:h-[300px]  md:w-[300px] h-[150px] w-[150px]"
          src="/images/login/bigcircle.png"
          alt=""
        />
        <img
          className="absolute left-0 bottom-0 animate-spin-slow-reverse-circle md:h-[180px] md:w-[180px] h-[90px] w-[90px]"
          src="/images/login/smallcircle.png"
          alt=""
        />
      </div>

      <section className="container mt-[8rem] sm:mt-0">
        <form>
          <div className="bg-primary-300/[.19] mx-auto backdrop-blur-[5.5px] max-w-[535px] w-full py-5 px-4 md:px-7 rounded-10 ">
            <h2 className="font-comfortaa text-32">Login as Admin</h2>
            <p className="text-16 pt-4 font-light">
              Log in to manage your RichLotto Lottri.
            </p>
            <div className="py-12 space-y-5">
              <div className="space-y-2">
                <label htmlFor="email">Your email address</label>
                <input
                  className=" !px-6"
                  type="email"
                  id="email"
                  placeholder="Enter your mail id"
                  name="email"
                  onChange={handleChange}
                />
                <div className="error">
                  {formError.email && (
                    <div className="form-eror">{formError.email}</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="Password">Password</label>
                <div className="relative">
                  <input
                    className=" !px-6"
                    type={setLock ? 'text' : 'password'}
                    id="Password"
                    placeholder="Enter your password"
                    name="password"
                    onChange={handleChange}
                  />
                  <span
                    onClick={lockFunction}
                    className="cursor-pointer absolute top-3 z-10 right-6 text-26 text-primary-600"
                  >
                    {setLock ? reactIcons.unlock : reactIcons.lock}
                  </span>
                  <div className="error">
                    {formError.password && (
                      <div className="form-eror">{formError.password}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="bg-gradient btn w-full">
              Login
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
