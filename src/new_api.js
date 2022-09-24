import axios from 'axios';
import Notiflix from 'notiflix';

export default class NewApi {
  constructor() {
    this.query = '';
    this.page = 1;
    this.length = '';
    this.notifi = '';
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
      this.length = seachResult.data.hits.length;
      this.totalHits = seachResult.data.totalHits;

      if (seachResult.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      return seachResult.data.hits;
    } catch (error) {
      this.errorNotification();
    }
  }

  successNotification() {
    Notiflix.Notify.success(`Hooray! We found ${this.totalHits} images.`);
  }
  errorNotification() {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
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
