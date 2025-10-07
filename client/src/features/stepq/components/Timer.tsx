import { useEffect, useRef, useState } from "react";
import image_frame from "../../../assets/stepq/timerframe_normal.png";


const Timer: React.FC = () => {
    const [elapsed_100ms, setElapsed_100ms] = useState(0);  // 100ms単位の経過時間
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 時間をmm:ss:d形式の文字列に変換する関数
    const formatRemainingTime = (time_100ms: number): string => {
        const totalSeconds = Math.floor(time_100ms / 10);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const deciSeconds = elapsed_100ms % 10;

        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');

        return `${paddedMinutes}:${paddedSeconds}.${deciSeconds}`;
    }

    const start = () => {
        if (timerRef.current) {
            return;
        }
        timerRef.current = setInterval(() => {
            setElapsed_100ms((prev) => prev + 1);
        }, 100);
    };

    const stop = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        start();
        return () => { stop(); };
    }, []);

    useEffect(() => {
        if (elapsed_100ms >= 1000) {
            stop();
        } 
    }, [elapsed_100ms]);


    // 表示用の残り秒数（100秒からカウントダウン）
    const displaySeconds = formatRemainingTime(Math.max(0, 1000 - Math.floor(elapsed_100ms)));

    return (
        <div className="w-full max-w-md flex justify-center mb-3">
            <div className="relative w-[50%] max-w-md flex justify-center">
                <img src={image_frame} className="w-[100%] h-full" />
                <div className="absolute w-full h-full top-[0%] flex items-center justify-center">
                    <p className="text-lg tracking-wide">{displaySeconds}</p>
                </div>
            </div>
        </div>
    );
};

export default Timer;