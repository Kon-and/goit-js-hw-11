import './css/styles.css';
import axios from 'axios';
import temp from './handlebars.hbs';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

export default class NewApi {
  constructor() {
    this.query = '';
    this.length = '';
    this.page = 1;
    this.totalHits = 0;
    this.hits = '';
  }

  async seach() {
    try {
      const API = axios.create({
        baseURL: `https://pixabay.com/api/`,
      });

      const key = '30089678-f9fe145ecd596460b7018b7a0';
      const seachResult = await API.get(
        `?key=${key}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      );
      if (seachResult.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      this.length = seachResult.data.hits.length;
      this.totalHits = seachResult.data.totalHits;
      return seachResult.data.hits;
    } catch (error) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }

  successNotification() {
    Notiflix.Notify.success(`Hooray! We found ${this.totalHits}images.`);
  }

  addPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get searchQuery() {
    this.query;
  }

  set searchQuery(newQuery) {
    this.query = newQuery;
  }
}

const newApi = new NewApi();
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSeach);
refs.loadButton.addEventListener('click', loadMore);

function onSeach(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  newApi.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  newApi.resetPage();

  pictureRender();
}

function render(picture) {
  refs.gallery.insertAdjacentHTML('beforeend', temp(picture));
}

function loadMore() {
  newApi.addPage();
  maxLoad();
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
  refs.gallery = new simpleLightbox('.gallery a');
}

async function maxLoad() {
  const loadMoreAnswerApi = await newApi.seach();
  render(loadMoreAnswerApi);
  scroll();
  gallery.refresh();
}
