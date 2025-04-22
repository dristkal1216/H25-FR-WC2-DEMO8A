import express from 'express';
import AproposIndexView from '#views/apropos/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();

router.get(['/', '/index'], async(req, res, next) => {
    const pageContent = new AproposIndexView().render();

    if (req.get('X-Requested-With') === 'XMLHttpRequest') {
        return res.send(pageContent);
    }
    
    const fullPage = new SharedLayoutView(pageContent,req.locals.user).render();
    res.send(fullPage);  
});

export default router;