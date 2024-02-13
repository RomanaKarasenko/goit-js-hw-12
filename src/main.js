// Описані у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';

// Описані у документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const fetchPicturesForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const userInput = document.querySelector('input');
const containerDiv = document.querySelector('.container');
const loadMoreBtn = document.querySelector('.btn-load');

let page = 1;
let per_page = 40;

const scrollToGallery = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const shouldHideLoadMoreButton = (loadedImagesCount, totalImagesCount) => {
  return loadedImagesCount >= totalImagesCount;
};

const renderPhotos = async data => {
  const markup = data.hits
    .map(data => {
      return `<li class="gallery-item"><a href="${data.webformatURL}">
            <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}"></a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p>
            <p><b>Downloads: </b>${data.downloads}</p>
            </li>`;
    })
    .join('');

  if (lightbox) {
    lightbox.destroy();
  }

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox = new SimpleLightbox('.gallery a', options);
  lightbox.on('show.simplelightbox');
  await lightbox.refresh();
};

const fetchPhotos = async userQuery => {
  const params = new URLSearchParams({
    page: page,
    per_page: per_page,
  });
  const apiKey = '22866492-0a616de8c4fefaa29c0c168ad';
  const query = userQuery || userInput.value;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
  );
  return response.data;
};

let lightbox;
let userQuery = '';

const options = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};

fetchPicturesForm.addEventListener('submit', async e => {
  showLoader();
  page = 1;
  e.preventDefault();
  gallery.innerHTML = '';
  userQuery = userInput.value;

  try {
    const photos = await fetchPhotos(userQuery);
    await renderPhotos(photos);
    fetchPicturesForm.reset();
    hideLoader();
    showLoadMoreButton();

    if (photos.hits.length === 0) {
      iziToast.error({
        title: '',
        backgroundColor: '#EF4040',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });

      scrollToGallery();
    }
    if (shouldHideLoadMoreButton(gallery.children.length, photos.totalHits)) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    hideLoadMoreButton();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();
  try {
    page += 1;
    const photos = await fetchPhotos();
    await renderPhotos(photos);
    hideLoader();

    scrollToGallery();

    if (gallery.children.length >= photos.totalHits) {
      iziToast.warning({
        title: '',
        message:
          'We are sorry, but you have reached the end of search results.',
      });
      hideLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    hideLoader();
    hideLoadMoreButton();
  }
});
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
