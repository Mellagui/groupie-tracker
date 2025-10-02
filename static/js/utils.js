// ----------------- Global Variables -----------------
var searchValue = "";
var locationsFilterValue = "";
var selectedMembers = [];
var creationDateRangeValue = { min: 0, max: 2024 };
var firstAlbumRangeValue = { min: 0, max: 2024 };

// Load JSON data (from <script id="artistData">)
const artists = JSON.parse(document.getElementById('artistData').textContent);

// Delete Relations (not needed in suggestions)
artists.forEach(artist => { delete artist.Relations });

// ----------------- Utility Functions -----------------

// Reset filters
function reset() {
    location.reload();
}

// Show results based on search + filters
function showResults() {
    const cards = document.getElementsByClassName('card');

    artists.forEach((artist, index) => {
        cards[index].style.display = 'none';

        // ---------- Search ----------
        const stringSearch = [artist.name, artist.firstAlbum, artist.creationDate];
        stringSearch.forEach(item => {
            if (String(item).toLowerCase().includes(searchValue)) {
                cards[index].style.display = '';
            }
        });

        const arraySearch = [artist.Locations, artist.members, artist.Dates];
        arraySearch.forEach(array => {
            array.some(item => {
                if (item.toLowerCase().includes(searchValue)) {
                    cards[index].style.display = '';
                }
            });
        });

        // ---------- Filters ----------
        // Locations
        if (locationsFilterValue && locationsFilterValue !== "All") {
            const hasLocation = artist.Locations.some(location => location.toLowerCase().includes(locationsFilterValue));
            if (!hasLocation) {
                cards[index].style.display = 'none';
            }
        }

        // Members count
        var membersLen = artist.members.length;
        if (!selectedMembers[membersLen - 1]) {
            cards[index].style.display = 'none';
        }

        // Creation date
        if (!(artist.creationDate >= creationDateRangeValue.min && artist.creationDate <= creationDateRangeValue.max)) {
            cards[index].style.display = 'none';
        }

        // First album
        const firstAlbumYear = parseInt(artist.firstAlbum.split('-')[2]);
        if (!(firstAlbumYear >= firstAlbumRangeValue.min && firstAlbumYear <= firstAlbumRangeValue.max)) {
            cards[index].style.display = 'none';
        }
    });
}
