import express from 'express';
import AccueilIndexView from '#views/accueil/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();

router.get(['/', '/index'], async(req, res, next) => {
    const pageContent = new AccueilIndexView().render();

    if (req.get('X-Requested-With') === 'XMLHttpRequest') {
        return res.send(pageContent);
    }
    
    const fullPage = new SharedLayoutView(pageContent).render();
    res.send(fullPage);  
});

export default router;