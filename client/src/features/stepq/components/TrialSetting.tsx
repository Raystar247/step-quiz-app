import { useState, type ReactEventHandler } from "react";
import stepqApi from "../api/stepqApi";
import { useSelector, type RootState } from "../../../stores";
import { useNavigate } from "react-router-dom";

const TrialSetting: React.FC = () => {

    const [form, setForm] = useState({
        keyword: '',
        passphrase: ''
    });
    const userId = useSelector((state: RootState) => state.user.id);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(userId);
        const str = await stepqApi.generateTrial(form.keyword, form.passphrase, userId);
        console.log(str);
        if (str == '') { return; }  // Trialデータの生成に失敗した場合何もしない
        navigate(`/stepq/${str}`);
    };

    return (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-800">
              Step Quiz
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500">
              出題者から指定された情報を入力してください
            </p>
          </div>
          <form className="space-y-4" >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                keyword
              </label>
              <input
                type="text"
                id="keyword"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
                placeholder="keyword"
                name='keyword'
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                passphrase
              </label>
              <input
                type="password"
                id="passphrase"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
                placeholder="********"
                name='passphrase'
                onChange={handleChange}
                required
              />
            </div>
    
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Start
            </button>
          </form>
        </div>
      );
};

export default TrialSetting;