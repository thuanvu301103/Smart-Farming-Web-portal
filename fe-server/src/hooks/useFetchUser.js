import { useState, useEffect } from "react";
import userApi from "./../api/userAPI";

const useFetchProfile = (userId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.profile(userId);
                //console.log("Response user's Profile fetch: ", userId, data);
                localStorage.setItem("curUsername", data.username);
                setData(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

const useFetchTopScripts = (userId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchTopScripts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.topScripts(userId);
                setData(data);
            } catch (err) {
                console.error("Error fetching top Scripts:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopScripts();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

const useFetchScriptsList = (userId) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchScriptsList = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.scriptsList(userId);
                //console.log("Fetch script List", data);
                setData(data);
            } catch (err) {
                console.error("Error fetching scripts:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScriptsList();
    }, [userId]); // Runs when `userId` changes

    return { data, loading, error };
};

export {
    useFetchProfile,
    useFetchTopScripts,
    useFetchScriptsList
};
