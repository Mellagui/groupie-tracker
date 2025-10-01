// ----------------- Filters -----------------
function init() {
    // Toggle filter visibility
    document.getElementById('toggleFilterButton').addEventListener('click', () => {
        const filterDiv = document.getElementById('filterDiv');
        const button = document.getElementById('toggleFilterButton');

        if (filterDiv.style.display === 'none' || filterDiv.style.display === '') {
            filterDiv.style.display = 'block';
            filterDiv.classList.add('active');
            button.textContent = 'Hide Filters';
        } else {
            filterDiv.style.display = 'none';
            filterDiv.classList.remove('active');
            button.textContent = 'Show Filters';
        }
    });

    // --------- Build Locations Filter ---------
    var searchArray = [...searchExemples];
    var locations = searchArray.filter(exemple => exemple.includes("Locations"));
    const locationsFilter = document.getElementById('locationsFilter');
    locations.forEach(item => {
        locationsFilter.innerHTML += "<option>" + item.split(" - ")[0] + "</option>";
    });

    // --------- Members, Creation Date, First Album ---------
    var maxMembers = 0;
    var creationDatesInterval = { min: 2024, max: 0 };
    var firstAlbumsInterval = { min: 2024, max: 0 };

    artists.forEach(artist => {
        if (maxMembers < artist.members.length) {
            maxMembers = artist.members.length;
        }
        if (creationDatesInterval.min > artist.creationDate) {
            creationDatesInterval.min = artist.creationDate;
        }
        if (creationDatesInterval.max < artist.creationDate) {
            creationDatesInterval.max = artist.creationDate;
        }
        const firstAlbumYear = parseInt(artist.firstAlbum.split('-')[2]);
        if (firstAlbumsInterval.min > firstAlbumYear) {
            firstAlbumsInterval.min = firstAlbumYear;
        }
        if (firstAlbumsInterval.max < firstAlbumYear) {
            firstAlbumsInterval.max = firstAlbumYear;
        }
    });

    // Members-count
    const membersCountFilter = document.getElementById('membersCountFilter');
    for (let i = 1; i <= maxMembers; i++) {
        membersCountFilter.innerHTML += `<input type='checkbox' id='${i}' checked/>${i}`;
        selectedMembers[i - 1] = true;
    }

    // Creation Date slider
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

    // First Album slider
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

    // Handlers
    locationsFilter.addEventListener('change', event => {
        locationsFilterValue = event.target.value.toLowerCase();
        showResults();
    });

    [...membersCountFilter.children].forEach((item, index) => {
        item.addEventListener('change', event => {
            selectedMembers[index] = event.target.checked;
            showResults();
        });
    });

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
init();
