import image_frame from "../../../assets/stepq/timerframe_normal.png"

const QuestionMain: React.FC = () => {
    return (
        <div>
        <div className="w-full flex justify-center mb-3">
        <div className="relative w-[50%] max-w-md flex justify-center">
            <img src={image_frame} className="w-[100%] h-full" />
            <div className="absolute w-full h-full top-[0%] flex items-center justify-center">
                <p className="text-lg tracking-wide">20:00.00</p>
            </div>
        </div>
        </div>
        <div className="w-full max-w-md bg-white shadow-md p-4 space-y-6">
            <div>
                第 <span className="font-semibold text-lg">1</span> 問
            </div>
            <div className=" shadow-sm rounded-sm p-2 text-left border-l-2 border-cyan-300">
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
        </div>
    );
};

export default QuestionMain;