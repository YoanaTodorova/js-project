var DefaultSearchCenter = {
	name: "Sofia, Bulgaria"
};


var searchControl;

function initializeGoogleSearch() {
	
	if (google.search) {
		searchControl = new google.search.SearchControl();

		var localSearch = new google.search.LocalSearch();
		searchControl.addSearcher(localSearch);
		searchControl.addSearcher(new google.search.WebSearch());
		searchControl.addSearcher(new google.search.VideoSearch());
		searchControl.addSearcher(new google.search.BlogSearch());
		searchControl.addSearcher(new google.search.NewsSearch());
		searchControl.addSearcher(new google.search.ImageSearch());

		
		localSearch.setCenterPoint(DefaultSearchCenter.name);

		// tell the searcher to draw itself and tell it where to attach
		searchControl.draw(document.getElementById("searchcontrol"));
		searchControl.execute();
	}
};


function updateGoogleSearch(stringToSearchFor) {
	if (searchControl) {
		//searchControl.draw(document.getElementById("searchcontrol"));
		searchControl.execute(stringToSearchFor);
	}
};