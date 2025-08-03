const Question: React.FC = () => {
    return (
        <div className="w-full max-w-md bg-white shadow-md p-4 space-y-6">
            <div>
                第 <span className="font-semibold text-lg">1</span> 問
            </div>
            <div className="shadow-sm rounded-sm p-2 text-left border-l-2 border-cyan-300">
                ヨルシカの楽曲『左右盲』で、歌詞の「心をわすれる」の表記はまさに心を忘れた何？
            </div>
            <form>
                <input 
                    type="text" 
                    id="answer" name="answer"
                    placeholder="answer"
                    className="w-full py-2 border-b focus:outline-none focus:border-b-2 focus:border-indigo-500 placeholder-gray-500 placeholder-opacity-50"
                />
            </form>
        </div>
    );
};

export default Question;