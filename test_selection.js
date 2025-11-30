
const initialData = [
    { id: "1", status: "success" },
    { id: "2", status: "pending" },
    { id: "3", status: "failed" },
];

let selected = [];
const items = initialData;
const ITEMS_PER_PAGE = 5;
const page = 1;

const paginatedItems = items.slice(0, ITEMS_PER_PAGE);

const isAllSelected = () =>
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selected.includes(item.id));

const toggleSelect = (id) => {
    if (selected.includes(id)) {
        selected = selected.filter((x) => x !== id);
    } else {
        selected = [...selected, id];
    }
};

const toggleSelectAll = () => {
    if (isAllSelected()) {
        const visibleIds = paginatedItems.map((i) => i.id);
        selected = selected.filter((id) => !visibleIds.includes(id));
    } else {
        const visibleIds = paginatedItems.map((i) => i.id);
        selected = [...new Set([...selected, ...visibleIds])];
    }
};

// Test 1: Select one item
console.log("Initial selected:", selected);
toggleSelect("1");
console.log("After selecting '1':", selected);
if (!selected.includes("1")) console.error("Test 1 Failed");

// Test 2: Select another item
toggleSelect("2");
console.log("After selecting '2':", selected);
if (!selected.includes("2")) console.error("Test 2 Failed");

// Test 3: Deselect item
toggleSelect("1");
console.log("After deselecting '1':", selected);
if (selected.includes("1")) console.error("Test 3 Failed");

// Test 4: Select All
selected = [];
toggleSelectAll();
console.log("After Select All:", selected);
if (selected.length !== 3) console.error("Test 4 Failed");

// Test 5: Deselect All
toggleSelectAll();
console.log("After Deselect All:", selected);
if (selected.length !== 0) console.error("Test 5 Failed");
