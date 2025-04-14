import express from 'express';
import AccueilIndexView from '#views/accueil/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();

router.get(['/', '/index'], async (req, res, next) => {
  // Create an instance and render its content.
  let pageContent = new AccueilIndexView().render();
  
  // If the rendered view is a DOM element (e.g. a <div>), convert it to a string.
  if (pageContent && typeof pageContent.outerHTML === 'string') {
    pageContent = pageContent.outerHTML;
  }
  
  // For AJAX requests, return the plain content.
  if (req.get('X-Requested-With') === 'XMLHttpRequest') {
    return res.send(pageContent);
  }
  
  // Now wrap the content in the shared layout
  let fullPage = new SharedLayoutView(pageContent).render();
  if (fullPage && typeof fullPage.outerHTML === 'string') {
    fullPage = fullPage.outerHTML;
  }
  
  res.send(fullPage);
});

export default router;
