import { useEffect, useState } from "react";
import type { RootState } from "../../../stores";
import { useSelector } from "../../../stores";
import { userApi } from "../api/userApi";
import type { User } from "../../../models";

export const Main = () => {

    const [user, setUser] = useState<User>()
    const userId = useSelector((state: RootState) => state.user.id);

    useEffect(() =>  {
        const getUser = async () => {
            // const id = sessionStorage.getItem("userId_");
            // if (!id) {
            //     console.error("User IDが見つかりません");
            //     return;
            // }
            const _user = await userApi.getUserInfo(userId);
            setUser(_user);
        };
        getUser();
    }, [userId]);

    if (!user) {
        return (<><p>エラー発生</p></>);
    }
    return (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6">
            <div>
                <h2 className="text-center text-2xl font-bold text-gray-800">
                ユーザー情報
                </h2>
                <p className="mt-1 text-center text-sm text-gray-500">
                登録されたアカウント情報を確認してください
                </p>
            </div>

            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    ユーザー名
                </label>
                <p className="mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50">
                    {user.username}
                </p>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    メールアドレス
                </label>
                <p className="mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50">
                    {user.email}
                </p>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    パスワード
                </label>
                <p className="mt-1 px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50">
                    {user.password}
                </p>
                </div>
            </div>
        </div>

    );
};