import{i as a,S as q,a as P}from"./assets/vendor-64b55ca9.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))d(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&d(u)}).observe(document,{childList:!0,subtree:!0});function r(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function d(o){if(o.ep)return;o.ep=!0;const s=r(o);fetch(o.href,s)}})();const y=document.querySelector(".form"),i=document.querySelector(".gallery"),p=document.querySelector("input"),$=document.querySelector(".container"),g=document.querySelector(".btn-load");let c=1;const E=15;let n,h="";const M={captions:!0,captionSelector:"img",captionType:"attr",captionsData:"alt",captionPosition:"bottom",animation:250},b=()=>{const{height:e}=document.querySelector(".gallery").firstElementChild.getBoundingClientRect();window.scrollBy({top:e*2,behavior:"smooth"})},O=(e,t)=>e>=t,w=async e=>{const t=e.hits.map(r=>`<li class="gallery-item"><a href="${r.webformatURL}">
            <img class="gallery-image" src="${r.webformatURL}" alt="${r.tags}"></a>
            <p><b>Likes: </b>${r.likes}</p>
            <p><b>Views: </b>${r.views}</p>
            <p><b>Comments: </b>${r.comments}</p>
            <p><b>Downloads: </b>${r.downloads}</p>
            </li>`).join("");n&&n.destroy(),i.insertAdjacentHTML("beforeend",t),n=new q(".gallery a",M),n.on("show.simplelightbox"),await n.refresh()},L=async e=>{const t="22866492-0a616de8c4fefaa29c0c168ad",r=e||p.value;return(await P.get(`https://pixabay.com/api/?key=${t}&q=${encodeURIComponent(r)}&image_type=photo&orientation=horizontal&safesearch=true&page=${c}&per_page=${E}`)).data},v=()=>{const e=document.createElement("span");e.classList.add("loader"),$.append(e)},m=()=>{const e=document.querySelector(".loader");e&&e.remove()},f=()=>{g.style.display="block"},l=()=>{g.style.display="none"},x=()=>{a.info({title:"",message:"We're sorry, but you've reached the end of search results."})},S=()=>{a.error({title:"",backgroundColor:"#EF4040",message:"An error occurred while loading images. Please try again."})};y.addEventListener("submit",async e=>{if(e.preventDefault(),!p.value.trim()){a.warning({title:"",message:"Enter a keyword to search."});return}v(),c=1,i.innerHTML="",h=p.value;try{const t=await L(h,c);await w(t),y.reset(),m(),f(),t.hits.length===0&&(a.error({title:"",backgroundColor:"#EF4040",message:"Sorry, there are no images matching your search query. Please try again!"}),b()),O(i.children.length,t.totalHits)?l():f()}catch(t){console.log(t),S(),l()}});g.addEventListener("click",async()=>{v();try{c+=1;const e=await L();await w(e),m(),b(),i.children.length>=e.totalHits&&(x(),l())}catch(e){console.log(e),S(),m(),l()}});
//# sourceMappingURL=commonHelpers.js.map