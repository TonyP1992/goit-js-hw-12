import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
  animationSpeed: 200,
  fadeSpeed: 200,
});

export function renderGallery(images) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) {
    console.error("Gallery container not found!");
    return;
  }

  const markup = images
    .map(
      (img) => `
      <li class="gallery-item">
        <a href="${img.largeImageURL}">
          <img
            src="${img.webformatURL}"
            alt="${img.tags}"
            loading="lazy"
          />
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

  gallery.insertAdjacentHTML("beforeend", markup);
  lightbox.refresh();
}

export function clearGallery() {
  const gallery = document.querySelector(".gallery");
  if (gallery) gallery.innerHTML = "";
}

export function showLoader() {
  document.querySelector(".loader")?.classList.remove("hidden");
}

export function hideLoader() {
  document.querySelector(".loader")?.classList.add("hidden");
}

export function showLoadMoreButton() {
  document.querySelector(".load-more")?.classList.remove("hidden");
}

export function hideLoadMoreButton() {
  document.querySelector(".load-more")?.classList.add("hidden");
}