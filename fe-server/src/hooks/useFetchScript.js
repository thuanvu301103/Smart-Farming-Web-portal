import { useState, useEffect } from "react";
import scriptApi from "./../api/scriptAPI";

const useFetchScriptInfo = (userId, scriptId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await scriptApi.getScriptInfo(userId, scriptId);
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

    return { data, loading, error };
};

export {
    useFetchScriptInfo,
};
