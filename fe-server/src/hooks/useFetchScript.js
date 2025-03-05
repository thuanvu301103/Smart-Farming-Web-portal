import { useState, useEffect } from "react";
import scriptApi from "./../api/scriptAPI";

const useFetchScriptInfo = (userId, scriptId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //console.log("Calling fetch Data:", { userId, scriptId });
    useEffect(() => {
        //console.log("UseEffect is running");
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await scriptApi.getScriptInfo(userId, scriptId);
                //console.log("Get script Info: ", data);
                setData(data);
            } catch (err) {
                console.error("Error fetching script info:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId, scriptId]);

    return { data, setData, loading, error };
};

const useFetchScriptFile = (filePath) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await scriptApi.getScriptFile(filePath);
                console.log("Fetching File data: ", data)
                setData(JSON.stringify(data, null, 2));
            } catch (err) {
                console.error("Error fetching script info:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filePath]);

    return { data, setData, loading, error };
};

export {
    useFetchScriptInfo,
    useFetchScriptFile
};
