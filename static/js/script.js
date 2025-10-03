var searchValue = "";
var locationsFilterValue = "";
var selected_box = [];
var creationDateRangeValue = [0, 2024];
var firstAlbumRangeValue = [0, 2024];

// Read and parse json (takes a string and returns the parsed object)
const artists = JSON.parse(document.getElementById('artistData').textContent);
const stack = [{ value: artists, parent: "" }];
const searchExemples = new Set();

// Extract values from data (artists) as a set() for search suggestions.
artists.forEach(artist => { delete artist.Relations });

while (stack.length > 0) {
    const current = stack.pop(); // Get and remove the last element from the stack
    const { value, parent } = current; // Destructure to get value and parent

    if (((typeof value === "string" && !value.includes("https")) || typeof value == "number")) { //&& (parent != "image")
        searchExemples.add(value + " - " + parent);
    } else if (value instanceof Array) {
        value.forEach((item) => {
            stack.push({ value: item, parent: parent }); // Keep the parent name the same for array items
        });
    } else if (value instanceof Object) {
        Object.entries(value).forEach(([key, val]) => {
            stack.push({ value: val, parent: key }); // Use the key as the parent name
        });
    }
}

document.getElementById('search').addEventListener('input', searchChangeHandler);

// Search change handler
function searchChangeHandler() {

    searchValue = this.value.toLowerCase(); // Get search value

    showResults()
    // -------------- Setting search suggestions --------------
    var searchSuggestions = []
    if (searchValue == "") {
        document.getElementById('suggestions').innerHTML = ""
        return
    }
    searchExemples.forEach((exemple) => {
        if (exemple.toLowerCase().includes(searchValue)) {
            searchSuggestions.push("<a class='a'>" + exemple + "</a></br>")
        }
    })
    document.getElementById('suggestions').innerHTML = String(searchSuggestions.slice(0, 10)).split(",").join(""); // Removes all commas

    // ------------ EventListener for suggestion click ------------
    const elements = [...document.getElementsByClassName('a')]; // Convert Html collection an array
    console.log(elements)
    elements.forEach((element) => {
        element.addEventListener("click", (event) => {
            const clickedValue = event.target.innerHTML.split(' - ')[0]

            console.log("Element clicked:", event.target.innerHTML); // Handle the click event
            document.getElementById('search').value = clickedValue // set search input
            document.getElementById('suggestions').innerHTML = "" // clear suggestions
            showResults(clickedValue.toLowerCase()) // Execute search change handler to load search
        });
    });
}

// Function to show results
function showResults() {

    const cards = document.getElementsByClassName('card');
    artists.forEach((artist, index) => {

        //----------- show based on search --------------
        cards[index].style.display = 'none';
        // Searching strings from artist...
        const stringSearch = [artist.name, artist.firstAlbum, artist.creationDate];
        stringSearch.forEach(item => {
            if (String(item).toLowerCase().includes(searchValue)) {
                cards[index].style.display = '';
            }
        })

        // Search arrays from artist...
        const arraySearch = [artist.Locations, artist.members, artist.Dates];
        arraySearch.forEach(array => {
            array.some((item) => {
                if (item.toLowerCase().includes(searchValue)) {
                    cards[index].style.display = '';
                }
            })
        })

        //----------- show based on filters --------------
        // locations
        if (locationsFilterValue && locationsFilterValue !== "All") {
        const hasLocation = artist.Locations.some(location => location.toLowerCase().includes(locationsFilterValue));
        if (!hasLocation) {
            cards[index].style.display = 'none';
        }}

        // members count
        if (!selected_box[artist.members.length - 1]) {
            cards[index].style.display = 'none';
        }

        // creation date
        if (!(artist.creationDate >= creationDateRangeValue.min && artist.creationDate <= creationDateRangeValue.max)) {
            cards[index].style.display = 'none';
        }

        // first album
        const firstAlbumYear = parseInt(artist.firstAlbum.split('-')[2]);
        if (!(firstAlbumYear >= firstAlbumRangeValue.min && firstAlbumYear <= firstAlbumRangeValue.max)) {
            cards[index].style.display = 'none';
        }
    })
}

// -------------------------------- Filters Part -------------------------------
function init() {
    const filter_btn = document.getElementById('filter_btn');
    const overlayer = document.getElementById("overlayer");
    const popup = document.getElementById("popup");
    filter_btn.addEventListener('click', () => {
        popup.style.display = "block";
        overlayer.style.display = "block";
    })
    overlayer.addEventListener('click', () => {
        popup.style.display = "none";
        overlayer.style.display = "none";
    })

    // ----- Locations -----
    const locations_option = document.getElementById('locationsFilter');
    var locations = [...searchExemples].filter(exemple => exemple.includes("Locations"));
    locations.forEach(location => locations_option.innerHTML += "<option class='locationsOption'>" + location.split(" - ")[0] + "</option>");

    // --------- Members, Creation Date, First Album ---------
    var maxMembers = 0;
    var creationDatesInterval = { min: 2024, max: 0 };
    var firstAlbumsInterval = { min: 2024, max: 0 };
    artists.forEach(artist => {
        const firstAlbumYear = parseInt(artist.firstAlbum.split('-')[2]);
        if (maxMembers < artist.members.length) maxMembers = artist.members.length;
        if (creationDatesInterval.min > artist.creationDate) creationDatesInterval.min = artist.creationDate;
        if (creationDatesInterval.max < artist.creationDate) creationDatesInterval.max = artist.creationDate;
        if (firstAlbumsInterval.min > firstAlbumYear) firstAlbumsInterval.min = firstAlbumYear;
        if (firstAlbumsInterval.max < firstAlbumYear) firstAlbumsInterval.max = firstAlbumYear;
    });

    // ----- Members-count -- checkbox -----
    const check_box_s = document.getElementById('membersCountFilter');
    for (let i = 1; i <= maxMembers; i++) {
        check_box_s.innerHTML += `<input type='checkbox' id='${i}' checked/>${i}`;
        selected_box[i - 1] = true;
    }

    // Creation Date slider ///////////////////////////
    const creationDateRange = document.getElementById('creationDateRange');
    noUiSlider.create(creationDateRange, {
        start: [creationDatesInterval.min, creationDatesInterval.max],
        connect: true,
        range: {
            'min': creationDatesInterval.min,
            'max': creationDatesInterval.max
        },
        step: 1
    });

    // First Album slider ///////////////////////////
    const firstAlbumRange = document.getElementById('firstAlbumRange');
    noUiSlider.create(firstAlbumRange, {
        start: [firstAlbumsInterval.min, firstAlbumsInterval.max],
        connect: true,
        range: {
            'min': firstAlbumsInterval.min,
            'max': firstAlbumsInterval.max
        },
        step: 1
    });

    // ------------ Handlers ------------
    locations_option.addEventListener('click', event => {
        locationsFilterValue = event.target.value
        showResults()
    })

    if (check_box_s) {
        [...check_box_s.children].forEach((box, index) => {
            box.addEventListener('change', event => {
                selected_box[index] = event.target.checked;
                showResults();
            });
        });
    }

    creationDateRange.noUiSlider.on('update', function (values) {
        minValueCreation.textContent = Math.round(values[0]);
        maxValueCreation.textContent = Math.round(values[1]);
        creationDateRangeValue.min = Math.round(values[0]);
        creationDateRangeValue.max = Math.round(values[1]);
        showResults();
    });

    firstAlbumRange.noUiSlider.on('update', function (values) {
        minValueAlbum.textContent = Math.round(values[0]);
        maxValueAlbum.textContent = Math.round(values[1]);
        firstAlbumRangeValue.min = Math.round(values[0]);
        firstAlbumRangeValue.max = Math.round(values[1]);
        showResults();
    });
}

const reset = () => location.reload();
init();