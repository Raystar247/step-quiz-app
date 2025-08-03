import { useEffect, useRef, useState } from "react";
import image_frame from "../../../assets/stepq/timerframe_normal.png";


const Timer: React.FC = () => {
    const measuring_time__100ms = 20 * 60 * 100;
    const [elapsed_100ms, setElapsed_100ms] = useState(0);  // 100ms単位の経過時間
    const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    return (
        <div className="w-full max-w-md flex justify-center mb-3">
            <div className="relative w-[50%] max-w-md flex justify-center">
                <img src={image_frame} className="w-[100%] h-full" />
                <div className="absolute w-full h-full top-[0%] flex items-center justify-center">
                    <p className="text-lg tracking-wide">{elapsed_100ms}</p>
                </div>
            </div>
        </div>
    );
};

export default Timer;