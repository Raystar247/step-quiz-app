import { useEffect, useRef, useState } from "react";
import normalTimerframe from "../../../assets/stepq/timerframe_normal.png";
import warningTimerframe from "../../../assets/stepq/timerframe_warning.png"; 


const Timer: React.FC = () => {

    const timeLimit: number = 1000; // 制限時間
    const warningTime: number = 600;    // 警告表示に変わる残り時間
    const warningElapsedTime = timeLimit - warningTime;
    const [elapsed_100ms, setElapsed_100ms] = useState(0);  // 100ms単位の経過時間
    const [timerframe, setTimerframe] = useState(normalTimerframe);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 時間をmm:ss:d形式の文字列に変換する関数
    const formatRemainingTime = (time_100ms: number): string => {
        const totalSeconds = Math.floor(time_100ms / 10);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const deciSeconds = time_100ms % 10;

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
        } else if (timerframe == normalTimerframe && elapsed_100ms >= warningElapsedTime) {
            setTimerframe(warningTimerframe);
        }
    }, [elapsed_100ms]);


    // 表示用の残り秒数
    const displaySeconds = formatRemainingTime(Math.max(0, timeLimit - elapsed_100ms));

    return (
        <div className="w-full max-w-md flex justify-center mb-3">
            <div className="relative w-[50%] max-w-md flex justify-center">
                <img src={timerframe} className="w-[100%] h-full" />
                <div className="absolute w-full h-full top-[0%] flex items-center justify-center">
                    <p className="text-xl tracking-wide">{displaySeconds}</p>
                </div>
            </div>
        </div>
    );
};

export default Timer;