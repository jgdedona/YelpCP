// Better yet, I could just have separate logic for my search feature (new page loaded if parameters present)
// and then I could simply "paginate" the campground entries loaded into memory
// By doing this, the find query will change depending on the search parameters (if present). This will
// also allow the cluster map to be updated dynamically depending on search results.
// The core logic will then stay the same. The only thing that changes is the variable fed to ejs.
// I would then be able to remove the search.js script completely because searches will be loaded on new page.

const container = document.getElementById('campgrounds');
const children = container.children;
const loadMore = document.getElementById('more');

if (children.length > 20) {
    for (let i = 0; i < 20; i++) {
        children[i].classList.remove('d-none');
    }
} else {
    for (let i = 0; i < children.length; i++) {
        children[i].classList.remove('d-none');
    }
    loadMore.style.display = 'none';
}

let nextCampground = 20;
let nextCampgroundsEnd = 40;

loadMore.addEventListener('click', (e) => {
    for (nextCampground; nextCampground < nextCampgroundsEnd; nextCampground++) {
        if (nextCampground >= children.length) {
            loadMore.style.display = 'none';
            break;
        }
        children[nextCampground].classList.remove('d-none');
    }
    nextCampgroundsEnd += 20;
});