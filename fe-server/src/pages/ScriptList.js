import React, { useEffect, useState } from 'react';
// Import components
import { PaginatedList } from '../components/List';
import { ScriptListItem } from '../components/ListItem';

const ScriptList = ({data, loading}) => {

    return (
        <div className="main-content">
            <PaginatedList
                ListItemComponents={ScriptListItem}
                items={data}
                search={'name'}
                loading={loading}
                addHref={'/new-script'}
                />
        </div>
    );
}

export default ScriptList;