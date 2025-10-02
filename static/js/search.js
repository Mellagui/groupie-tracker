// ----------------- Build Search Examples -----------------
const searchExemples = new Set();
const stack = [{ value: artists, parent: "" }];

while (stack.length > 0) {
    const current = stack.pop();
    const { value, parent } = current;

    if (((typeof value === "string" && !value.includes("https")) || typeof value == "number")) {
        searchExemples.add(value + " - " + parent);
    } else if (value instanceof Array) {
        value.forEach(item => stack.push({ value: item, parent }));
    } else if (value instanceof Object) {
        Object.entries(value).forEach(([key, val]) => {
            stack.push({ value: val, parent: key });
        });
    }
}

// ----------------- Search Handlers -----------------
document.getElementById('search').addEventListener('input', searchChangeHandler);

function searchChangeHandler() {
    searchValue = this.value.toLowerCase();

    // Show results
    showResults();

    // Build suggestions
    let searchSuggestions = [];
    if (searchValue === "") {
        document.getElementById('suggestions').innerHTML = "";
        return;
    }

    searchExemples.forEach(exemple => {
        if (exemple.toLowerCase().includes(searchValue)) {
            searchSuggestions.push("<a class='a'>" + exemple + "</a></br>");
        }
    });

    document.getElementById('suggestions').innerHTML =
        String(searchSuggestions.slice(0, 10)).split(",").join("");

    // Click handler for suggestions
    [...document.getElementsByClassName('a')].forEach(element => {
        element.addEventListener("click", (event) => {
            const clickedValue = event.target.innerHTML.split(' - ')[0];
            document.getElementById('search').value = clickedValue;
            document.getElementById('suggestions').innerHTML = "";
            showResults(clickedValue.toLowerCase());
        });
    });
}
