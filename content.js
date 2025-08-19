// Thumbnail detection approach inspired by MrBeastify extension
// https://github.com/MagicJinn/MrBeastify-Youtube
function addImageToThumbnails() {
  const selectors = [
    'ytd-thumbnail a > yt-image > img.yt-core-image', // general video
    'ytm-shorts-lockup-view-model > a > div.shortsLockupViewModelHostThumbnailContainer', // short video
    'yt-thumbnail-view-model > div.yt-thumbnail-view-model__image', // general video
    // 'div#container > div.html5-video-player > div.html5-video-container', // NOTE: too powerful for now, we are not ready yet
  ];
  
  selectors.forEach(selector => {
    const thumbnailImages = document.querySelectorAll(selector);
    thumbnailImages.forEach(thumbnailImg => {
      // Find the thumbnail container to position overlay
      const container = thumbnailImg.closest('ytd-thumbnail') || thumbnailImg.parentElement;
      
      if (!container || container.querySelector('.overlay-image')) {
        return;
      }

      try {
        const overlayImg = document.createElement('img');
        overlayImg.src = chrome.runtime.getURL('with-fwmc.png');
        
        // Ensure container has relative positioning
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') {
          container.style.position = 'relative';
        }
        
        overlayImg.style.position = 'absolute';
        overlayImg.style.bottom = '0';
        overlayImg.style.right = '0';
        overlayImg.style.maxWidth = '55%';
        overlayImg.style.maxHeight = '41%';
        overlayImg.style.zIndex = '10';
        overlayImg.classList.add('overlay-image');

        container.firstElementChild.appendChild(overlayImg);
      } catch (error) {
        console.log('FUWAMOCO Extension: Context invalidated, stopping overlay injection');
        return;
      }
    });
  });
}

const observer = new MutationObserver(addImageToThumbnails);
observer.observe(document.body, { childList: true, subtree: true });

addImageToThumbnails();
