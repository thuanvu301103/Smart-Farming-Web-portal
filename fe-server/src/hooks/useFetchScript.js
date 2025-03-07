﻿import { useState, useEffect, useCallback  } from "react";
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

const useFetchScriptFile = (userId, scriptId, version) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //console.log("Version: ", version);

    const fetchData = useCallback(async () => {
        // No fetch condition 
        if (!userId || !scriptId || version == null) return;
        if (version == -1.0) return;

        setLoading(true);
        setError(null);
        try {
            const filePath = `${userId}%2F${scriptId}%2Fv${version.toFixed(1)}.json`;
            const data = await scriptApi.getScriptFile(filePath);
            //console.log("Fetching File data: ", data);
            setData(JSON.stringify(data, null, 2));
        } catch (err) {
            console.error("Error fetching script file:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [userId, scriptId, version]);

    useEffect(() => {
        if (!userId || !scriptId || version == null) return;
        if (version == -1.0) return;
        fetchData();
    }, [userId, scriptId, version]);

    // Reload function
    const reload = () => {
        fetchData();
    };

    return { data, setData, loading, error, reload };
};

export {
    useFetchScriptInfo,
    useFetchScriptFile
};
