import express from 'express';
import ContactIndexView from '#views/Contact/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();

router.get(['/', '/index'], async(req, res, next) => {
    const pageContent = new ContactIndexView().render();

    if (req.get('X-Requested-With') === 'XMLHttpRequest') {
        return res.send(pageContent);
    }
    
    const fullPage = new SharedLayoutView(pageContent).render();
    res.send(fullPage);  
});

export default router;