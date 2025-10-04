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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  currentQuery = form.elements["search-text"].value.trim();
  currentPage = 1; 
  clearGallery();
  loadMoreBtn.classList.add("hidden");

  if (!currentQuery) {
    iziToast.error({ title: "Error", message: "Enter a search term!" });
    return;
  }

  await fetchImages();
});

loadMoreBtn.addEventListener("click", async () => {
  currentPage += 1; 
  await fetchImages(true); 
});

async function fetchImages(doScroll = false) {
  try {
    showLoader();

    const data = await getImagesByQuery(currentQuery, currentPage);

    if (!data.hits || data.hits.length === 0) {
      if (currentPage === 1) {
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
      loadMoreBtn.classList.add("hidden");
      return;
    }

    renderGallery(data.hits);
    totalHits = data.totalHits;

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (currentPage < totalPages) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      loadMoreBtn.classList.add("hidden");
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
        timeout: 4000
      });
    }


    if (doScroll) {
      const galleryItem = document.querySelector(".gallery-item");
      if (galleryItem) {
        const { height: cardHeight } = galleryItem.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: "smooth"
        });
      }
    }

  } catch (error) {
    iziToast.error({ title: "Error", message: "Failed to fetch images. Try later!" });
    console.error("API Error:", error);
  } finally {
    hideLoader();
  }
}