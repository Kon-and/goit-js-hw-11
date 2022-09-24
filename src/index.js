import './css/styles.css';
import NewApi from './new_api.js';
import temp from './handlebars.hbs';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const newApi = new NewApi();
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadButton: document.querySelector('.load-more'),
};

let gallery = '';

refs.searchForm.addEventListener('submit', onSeach);
refs.loadButton.addEventListener('click', loadMore);

function onSeach(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  newApi.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  newApi.resetPage();
  pictureRender();
  gallery = new simpleLightbox('.gallery a');
}

function render(picture) {
  refs.gallery.insertAdjacentHTML('beforeend', temp(picture));
}

async function pictureRender() {
  const apiAnswer = await newApi.seach();

  if (newApi.query === '') {
    refs.loadButton.classList.add('is-hidden');
    return Notiflix.Notify.failure(`Please enter a query`);
  }

  if (newApi.length < 40) {
    refs.loadButton.classList.add('is-hidden');
  } else {
    refs.loadButton.classList.remove('is-hidden');
    newApi.successNotification();
  }
  render(apiAnswer);
}

async function maxLoad() {
  const loadMoreAnswerApi = await newApi.seach();
  render(loadMoreAnswerApi);
  scroll();
  gallery.refresh();
}

function loadMore() {
  newApi.addPage();
  maxLoad();
  let totalPages = Math.ceil(newApi.totalHits / 40);
  if (newApi.page >= totalPages) {
    newApi.errorNotification();
    refs.loadButton.classList.add('is-hidden');
  }
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery a')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
