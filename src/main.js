import { renderGallery, clearGallery, showLoader, hideLoader } from './js/render-functions.js';
import { getImagesByQuery } from './js/pixabay-api.js';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let currentQuery = "";
let currentPage = 1;
let totalHits = 0;
const PER_PAGE = 15;

let currentAbortCtrl = null;

function updateLoadMoreVisibility(totalHits, currentPage, PER_PAGE) {
  const totalPages = Math.ceil((totalHits || 0) / PER_PAGE);
  if (currentPage < totalPages) {
    loadMoreBtn?.classList.remove("hidden");
  } else {
    loadMoreBtn?.classList.add("hidden");
  }
}

function showNoResultsToast() {
  iziToast.show({
    message: "Sorry, there are no images matching your search query.<br>Please try again!",
    position: "topRight",
    timeout: 4000,
    close: true,
    progressBar: false,
    backgroundColor: "#f44336",
    messageColor: "#fff",
    layout: 2,
    maxWidth: 420,
    class: "custom-toast",
    icon: "fa fa-times-circle"
  });
}

function showEndOfResultsToast() {
  iziToast.info({
    message: "We're sorry, but you've reached the end of search results.",
    position: "topRight",
    timeout: 4000
  });
}

async function fetchImages({ doScroll = false } = {}) {
  if (currentAbortCtrl) currentAbortCtrl.abort();
  currentAbortCtrl = new AbortController();

  try {
    showLoader();

    const data = await getImagesByQuery(
      currentQuery,
      currentPage,
      PER_PAGE,
      currentAbortCtrl.signal
    );

    if (!data.hits || data.hits.length === 0) {
      if (currentPage === 1) showNoResultsToast();
      loadMoreBtn?.classList.add("hidden");
      return;
    }

    renderGallery(data.hits);
    totalHits = data.totalHits || 0;

    const totalPages = Math.ceil(totalHits / PER_PAGE);
    updateLoadMoreVisibility(totalHits, currentPage, PER_PAGE);
    if (currentPage >= totalPages) showEndOfResultsToast();

    if (doScroll) {
      const galleryItem = document.querySelector(".gallery-item");
      if (galleryItem) {
        const { height: cardHeight } = galleryItem.getBoundingClientRect();
        window.scrollBy({ top: cardHeight * 2, behavior: "smooth" });
      }
    }
  } catch (error) {
    if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
    iziToast.error({ title: "Error", message: "Failed to fetch images. Try later!" });
    console.error("API Error:", error);
  } finally {
    hideLoader();
    form.querySelector("button[type='submit']")?.removeAttribute("disabled");
    loadMoreBtn?.removeAttribute("disabled");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  currentQuery = form.elements["search-text"].value.trim();
  currentPage = 1;
  clearGallery();
  loadMoreBtn?.classList.add("hidden");

  if (!currentQuery) {
    iziToast.error({ title: "Error", message: "Enter a search term!" });
    return;
  }

  form.querySelector("button[type='submit']")?.setAttribute("disabled", "true");
  await fetchImages();
});

loadMoreBtn?.addEventListener("click", async () => {
  currentPage += 1;
  loadMoreBtn.setAttribute("disabled", "true");
  await fetchImages({ doScroll: true });
});