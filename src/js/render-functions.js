import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});


export function renderGallery(images) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("Gallery container not found!");
    return;
  }

  const cards = images
    .map(
      (img) => `
    <li class="gallery-item">
      <a href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy">
      </a>
      <div class="info">
        <p><b>Likes:</b> ${img.likes}</p>
        <p><b>Views:</b> ${img.views}</p>
        <p><b>Comments:</b> ${img.comments}</p>
        <p><b>Downloads:</b> ${img.downloads}</p>
      </div>
    </li>
  `
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", cards);

  
  lightbox.refresh();
}


export function clearGallery() {
  const gallery = document.querySelector(".gallery");
  if (gallery) {
    gallery.innerHTML = "";
  }
}


export function showLoader() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.classList.remove("hidden");
  }
}


export function hideLoader() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.classList.add("hidden");
  }
}


export function showLoadMoreButton() {
  const btn = document.querySelector(".load-more");
  if (btn) {
    btn.classList.remove("hidden");
  }
}


export function hideLoadMoreButton() {
  const btn = document.querySelector(".load-more");
  if (btn) {
    btn.classList.add("hidden");
  }
}