const searchBar = document.getElementById('search');
const options = document.getElementById('options');
// const campgroundDiv = document.querySelector('#campgrounds');
searchBar.addEventListener('input', (e) => {
    const searchTerm = searchBar.value;
    const searchOption = options.value;
    if (searchOption === 'title') {
        for (let campground of campgrounds) {
            const currCamp = document.getElementById(`${campground._id}`);
            if (!campground.title.toLowerCase().includes(searchTerm.toLowerCase())) {
                currCamp.style.display = 'none';
            } else {
                currCamp.style.display = 'block';
            }
        }
    } else {
        for (let campground of campgrounds) {
            const currCamp = document.getElementById(`${campground._id}`);
            if (!campground.location.toLowerCase().includes(searchTerm.toLowerCase())) {
                currCamp.style.display = 'none';
            } else {
                currCamp.style.display = 'block';
            }
        }
    }
});


const evt = new Event("input");
options.addEventListener('input', (e) => {
    searchBar.dispatchEvent(evt);
});