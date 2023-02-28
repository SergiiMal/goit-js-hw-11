import axios from "axios";

const url = 'https://pixabay.com/api/';
const key = '33515786-5b52176933b5882b00b6da0a7';

export default class PixabayApiService{
	constructor() {
		this.serchQuery = '';
		this.currentPage = 1;
		this.currentHits = 0;
	}

	async axiosArticles() {
		
		const queryParams = {
			key: key,
			q: this.serchQuery,
			image_type: 'photo',
			orientation: 'horizontal',
			safesearch: true,
			page: this.page,
			per_page: 40,
		};
		

		const response = await axios.get(url, {
			params: queryParams,
		});
		
			
		this.addCurrentPage();
		return response.data;
	}

	addCurrentPage() {
		this.page += 1; 
	}

	addCurrentHits(hitsLength) {
		
		this.currentHits += hitsLength;
	}

	resetPage() {
		this.page = 1;
	}

	get query() {
		return this.serchQuery;
	}

	set query(newQuery) {	
		this.serchQuery = newQuery;
	}

}