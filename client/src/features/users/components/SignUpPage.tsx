import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { type AppDispatch, type RootState, useSelector } from "../../../stores";
import type { SignUpData } from "../type";
import userApi from "../api/userApi";
import LiquidGlass from "../../../fundamentalComponents/LiquidGlass";

// Zodスキーマ定義
const signUpSchema = z.object({
  username: z.string().min(1, { message: "ユーザー名を入力してください" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string()
    .min(8, { message: "パスワードは8文字以上必要です" })
    .max(12, { message: "パスワードは12文字以内である必要があります" })
    .regex(/[A-Z]/, { message: "パスワードには大文字を含めてください" })
    .regex(/[a-z]/, { message: "パスワードには小文字を含めてください" })
    .regex(/[0-9]/, { message: "パスワードには数字を含めてください" }),
});

const SignUpPage = () => {
  // const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignUpData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // 入力時にエラークリア
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = signUpSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof SignUpData, string>> = {};
      validation.error.issues.forEach((err: { path: (string | number | symbol)[]; message: string | undefined; }) => {
        const field = err.path[0] as keyof SignUpData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    await userApi.signUp(form);
    navigate("/signin");
  };

  useEffect(() => {
    if (userInfo.isSignedIn) {
      navigate("/setting_");
    }
  }, [userInfo]);

  return (
    <LiquidGlass as="div" colorScheme="white" className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6 m-[2rem]" onSubmit={handleSubmit}
    
    >
      <div>
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Sign up
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          情報を入力して新しいユーザーを作成する
        </p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className={`mt-1 w-full px-4 py-2 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800`}
            placeholder="yourname"
            value={form.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`mt-1 w-full px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800`}
            placeholder="your@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`mt-1 w-full px-4 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800`}
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <LiquidGlass
          type="submit"
          centerContent
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Sign up
        </LiquidGlass>
      </form>

      <div className="text-center text-sm text-gray-600">
        すでにアカウントをお持ちの方は{" "}
        <a href="/signin" className="text-indigo-600 hover:underline">
          ログイン
        </a>
      </div>
    </LiquidGlass>
  );
};

export default SignUpPage;
