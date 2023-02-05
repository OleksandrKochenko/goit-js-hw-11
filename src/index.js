import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const input = document.querySelector('[type="text"]');
const submitBtn = document.querySelector('[type = "submit"]');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
let lightbox = new SimpleLightbox('.gallery a');
let page = 1;
let hits = 0;
let totalHits = 0;

const searchParams = new URLSearchParams({
    key: '33271792-fb75e177a9af11daf6327433e',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
});

submitBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    gallery.innerHTML = '';
    page = 1;
    hits = 0;
    loadMore.style.visibility = 'hidden';
    if (input.value.trim() === '') {
        gallery.innerHTML = '';
        Notiflix.Notify.warning('Please fill in search field');
        return;
    } else {
        fetchPhotos()
            .then((photos) => {
                renderGallery(photos);
                totalHits = photos.totalHits;
                if (totalHits > 0) {
                    Notiflix.Notify.success(`Hooray! We've found ${totalHits} images.`);
                };
            })
            .catch(() => Notiflix.Notify.failure('Sorry, something went wrong. Try search again.'));
    };
});

function fetchPhotos() {
    const url = `https://pixabay.com/api/?${searchParams}&q=${input.value.trim()}&page=${page}`;
    page += 1;
    return fetch(url).then(
        (responce) => {
            if (!responce.ok) {
                throw new Error();
            };
            return responce.json();
        }
    );
};

function renderGallery(photos) {
    if (photos.hits.length === 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        return
    }
    const markup = photos.hits
        .map((item) => 
        `<a class="gallery__item" href="${item.largeImageURL}">
            <div class="wraper">
            <img
                class="gallery__image"
                src="${item.webformatURL}"
                alt="${item.tags}"
            />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b><br>
                    ${item.likes}
                </p>
                <p class="info-item">
                    <b>Views</b><br>
                    ${item.views }
                </p>
                <p class="info-item">
                    <b>Comments</b><br>
                    ${item.comments}
                 </p>
                <p class="info-item">
                    <b>Downloads</b><br>
                    ${item.downloads}
                </p>
            </div>
            </div>
        </a>`)
        .join('');
    gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
    totalHits = photos.totalHits;
    hits += photos.hits.length;
    loadMore.style.visibility = "visible";
    if (totalHits <= hits) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        loadMore.style.visibility = 'hidden';
    };
};

gallery.addEventListener('click', handleClick);

function handleClick(event) {
    event.preventDefault();
    const element = event.target;
    lightbox.open(element);
};

loadMore.addEventListener('click', () => {
    if (input.value.trim() === '') {
        gallery.innerHTML = '';
        Notiflix.Notify.warning('Please fill in search field');
        return;
    };
    fetchPhotos()
        .then((photos) => {
            renderGallery(photos);
        })
        .catch(() => Notiflix.Notify.failure(
            'Sorry, something went wrong. Try search again.'));
});