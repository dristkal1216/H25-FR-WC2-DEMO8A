import express from 'express';
import ContactIndexView from '#views/contact/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();

router.get(['/', '/index'], async (req, res, next) => {
    const pageContent = new ContactIndexView().render();

    if (req.get('X-Requested-With') === 'XMLHttpRequest') {
        return res.send(pageContent);
    }

    const fullPage = new SharedLayoutView(pageContent,req.locals.user).render();
    res.send(fullPage);
});


router.post(['/', '/index'], async (req, res, next) => {
    // récupère les champs email et message
    const { email, message } = req.body;
    console.log("email =", email);
    console.log("message =", message);
    const pageContent = new ContactIndexView().render();
  
    const fullPage = new SharedLayoutView(pageContent,req.locals.user).render();
    res.send(fullPage);
  });
  

export default router;