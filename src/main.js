import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const fetchPicturesForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const userInput = document.querySelector('input');
const containerDiv = document.querySelector('.container');
const loadMoreBtn = document.querySelector('.btn-load');

let currentPage = 1;
const itemsPerPage = 40; // Кількість зображень на сторінку
let lightbox;
let userQuery = '';

const lightboxOptions = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};

const scrollToGallery = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const shouldHideLoadMoreButton = (loadedImagesCount, totalImagesCount) =>
  loadedImagesCount >= totalImagesCount;

const renderGalleryItems = async (data) => {
  const markup = data.hits
    .map(
      (item) => `<li class="gallery-item"><a href="${item.webformatURL}">
            <img class="gallery-image" src="${item.webformatURL}" alt="${item.tags}"></a>
            <p><b>Likes: </b>${item.likes}</p>
            <p><b>Views: </b>${item.views}</p>
            <p><b>Comments: </b>${item.comments}</p>
            <p><b>Downloads: </b>${item.downloads}</p>
            </li>`
    )
    .join('');

  if (lightbox) {
    lightbox.destroy();
  }

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox = new SimpleLightbox('.gallery a', lightboxOptions);
  lightbox.on('show.simplelightbox');
  await lightbox.refresh();
};

const fetchImages = async (userQuery) => {
  const apiKey = '22866492-0a616de8c4fefaa29c0c168ad';
  const query = userQuery || userInput.value;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${itemsPerPage}`
  );
  return response.data;
};

const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  containerDiv.append(loader);
};

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

const showLoadMoreButton = () => {
  loadMoreBtn.style.display = 'block';
};

const hideLoadMoreButton = () => {
  loadMoreBtn.style.display = 'none';
};

const showEndOfResultsMessage = () => {
  iziToast.info({
    title: '',
    message: "We're sorry, but you've reached the end of search results.",
  });
};

const showErrorToast = () => {
  iziToast.error({
    title: '',
    backgroundColor: '#EF4040',
    message: 'An error occurred while loading images. Please try again.',
  });
};

fetchPicturesForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Check if the user entered a non-empty value
  if (!userInput.value.trim()) {
    iziToast.warning({
      title: '',
      message: 'Enter a keyword to search.',
    });
    return;
  }

  showLoader();
  currentPage = 1;
  gallery.innerHTML = '';
  userQuery = userInput.value;

  try {
    const images = await fetchImages(userQuery);
    await renderGalleryItems(images);
    fetchPicturesForm.reset();
    hideLoader();
    showLoadMoreButton();

    if (images.hits.length === 0) {
      iziToast.error({
        title: '',
        backgroundColor: '#EF4040',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });

      scrollToGallery();
    }

    if (shouldHideLoadMoreButton(gallery.children.length, images.totalHits)) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    showErrorToast();
    hideLoadMoreButton();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();
  try {
    currentPage += 1;
    const images = await fetchImages();
    await renderGalleryItems(images);
    hideLoader();

    scrollToGallery();

    if (gallery.children.length >= images.totalHits) {
      showEndOfResultsMessage();
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    showErrorToast();
    hideLoader();
    hideLoadMoreButton();
  }
});
