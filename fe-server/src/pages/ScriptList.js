// Import components
import { PaginatedList } from '../components/List';
import { ScriptListItem } from '../components/ListItem';

const ScriptList = () => {

    // Dump script items list
    const items = [
        { name: "Magic 1", description: "This is a simple item 1" },
        { name: "Magic 2", description: "This is a simple item 2" },
        { name: "Magic 3", description: "This is a simple item 3" },
    ];

    return (
        <div className="main-content">
            <PaginatedList
                ListItemComponents={ScriptListItem}
                items={items} search={'name'}
            />
        </div>
        );
}

export default ScriptList;