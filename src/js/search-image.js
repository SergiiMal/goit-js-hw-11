import PixabayApiService from "./pixabay-servise.js";
import { Notify } from "notiflix";
import createGalleryMarkup from "./gallery-markup";
import simpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
	form: document.getElementById('search-form'),
	gallery: document.querySelector('.gallery'),
	loadMoreBtn: document.querySelector('#load-more-btn'),	
}

const pixabayApiService = new PixabayApiService();
const gallery = new simpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);


async function onSubmit(e) {
	e.preventDefault();

	pixabayApiService.query = e.currentTarget.elements.searchQuery.value.trim();

	if (pixabayApiService.query === '') {
		clearHitsMarkup();
		loadMoreBtnDisplay('none');
		Notify.failure('Sorry, there are no images matching your search query. Please try again.')
		e.currentTarget.reset();
		return;
	}

	pixabayApiService.currentHits = 0;
	pixabayApiService.resetPage();
	e.currentTarget.reset();

	try {
		const { hits, totalHits } = await pixabayApiService.axiosArticles();

		if (totalHits > 0) {
			loadMoreBtnDisplay('block');
			clearHitsMarkup();
			addHitsMarkup(hits);

			Notify.success(`Hooray! We found ${totalHits} images.`)

			pixabayApiService.addCurrentHits(hits.length);
		} else {
			clearHitsMarkup();
			loadMoreBtnDisplay('none');
			Notify.failure('Sorry, there are no images matching your search query. Please try again.');
		}
	} catch (error) {
			
	}
}

	async function onLoadMore(e) {
		try {
			const { hits, totalHits } = await pixabayApiService.axiosArticles();
			pixabayApiService.addCurrentHits(hits.length);
			addHitsMarkup(hits);

			if (pixabayApiService.currentHits === totalHits) {
				loadMoreBtnDisplay('none');
				return Notify.warning("We're sorry, but you've reached the end of search results."
				);
			}
		}catch (error) {			
			loadMoreBtnDisplay('none');

			return Notify.warning("We're sorry, but you've reached the end of search results.");
		}
	}

	function addHitsMarkup(hits) {
		refs.gallery.insertAdjacentHTML("beforeend", createGalleryMarkup(hits));
		gallery.refresh();
	}

	function clearHitsMarkup() {
		refs.gallery.innerHTML = '';
	}

	function loadMoreBtnDisplay(display) {
  refs.loadMoreBtn.style.display = `${display}`;
}




