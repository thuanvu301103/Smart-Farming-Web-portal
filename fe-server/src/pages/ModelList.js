import React from 'react';
// Import components
import { PaginatedList } from '../components/List';
import { ModelListItem } from '../components/ListItem';


const ModelList = ({data, loading}) => {
    return (
        <div className="main-content">
            <PaginatedList
                ListItemComponents={ModelListItem}
                items={data}
                search={'name'}
                loading={loading}
                addHref={'/new-model'}
            />
        </div>
    );
}

export default ModelList;