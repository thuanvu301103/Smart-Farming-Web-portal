import { useState, useEffect } from "react";
import userApi from "./../api/userAPI";

const useFetchProfile = (userId) => {
    const [profile, setProfile] = useState(null);
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
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]); // Runs when `userId` changes

    return { profile, loading, error };
};

const useFetchTopScripts = (userId) => {
    const [topScripts, setTopScripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchTopScripts = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await userApi.topScripts(userId);
                setTopScripts(data);
            } catch (err) {
                console.error("Error fetching top Scripts:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopScripts();
    }, [userId]); // Runs when `userId` changes

    return { topScripts, loading, error };
};

export {
    useFetchProfile,
    useFetchTopScripts,
};
