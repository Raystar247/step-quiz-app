import { useEffect, useState } from "react";
import type { SignInData } from "../type";
import { useDispatch } from "react-redux";
import { signInAsync } from "../store/user";
import { type AppDispatch, type RootState, useSelector } from "../../../stores";
import { useNavigate } from "react-router-dom";
import { LiquidGlass } from "../../../fundamentalComponents/LiquidGlass";

export const SignInPage = () => {

  const dispatch = useDispatch<AppDispatch>();
    const [form, setForm] = useState<SignInData>({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const userInfo = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

  useEffect(() => {
    if (userInfo.isSignedIn) {
      navigate('/setting_');
    }
  }, [userInfo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(signInAsync(form));
    };

    return (
        <LiquidGlass as="div" colorScheme="white" hoverEffect={false} className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6 m-[2rem] mt-10" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-800">
              Log in
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500">
              アカウント情報を入力してください
            </p>
          </div>
          <form className="space-y-4" >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
                placeholder="your@example.com"
                name='email'
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
                placeholder="********"
                name='password'
                onChange={handleChange}
                required
              />
            </div>
    
            <LiquidGlass as="button"
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
              centerContent
            >
              Sign in
            </LiquidGlass>
          </form>
    
          <div className="text-center text-sm text-gray-600">
            アカウントを持っていない方は{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              ユーザー登録
            </a>
          </div>
        </LiquidGlass>
      );
};