import { useState } from "react";
import { useParams } from "react-router-dom";
import { ENDPOINT_URL } from "../../../references/util";
import axios from "axios";
import type { Answer, Question, Trial, UnitString } from "../type";
import stepqApi from "../api/stepqApi";
import SelectHeader from "./SelectHeader";


const ScoringPage = () => {
    const urlParam = useParams<{ qgroupId: string }>();
    const [unit, setUnit] = useState<UnitString>('user');
    const [answers, setAnswers] = useState<Answer[]>([]);



    return (<SelectHeader
        qgroupId={urlParam.qgroupId}
        setAnswers={setAnswers}
    />);
};

export default ScoringPage;