import React, { useEffect, useState } from 'react';
// Import components
import { PaginatedList } from '../components/List';
import { ScriptListItem } from '../components/ListItem';

import axios from 'axios';

const ModelList = ({data, loading}) => {
    
    /*
    const [scripts, setScripts] = useState(data);
    const [loading, setLoading] = useState(true); // Add loading state
    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/scripts');
                setScripts(response.data);
            } catch (error) {
                console.error('Error fetching scripts:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchScripts();
    }, []);
    */

    return (
            <div className="main-content">
                <PaginatedList
                    ListItemComponents={ScriptListItem}
                    items={data}
                    search={'name'}
                    loading={loading}
                    />
            </div>
        );
}

export default ModelList;