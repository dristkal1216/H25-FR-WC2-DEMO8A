import express from 'express';
import { championsStore } from '#core/data-stores/index.js';
import ChampionsIndexView from '#views/champion/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();



router.get(['/', '/view', 'view/index'], async(req, res, next) => {    
  const champions = await championsStore.read();

  if (req.get('X-Requested-With') === 'XMLHttpRequest') {
      return res.json(champions);
  }
  
  const pageContent = new ChampionsIndexView(champions).render();
      
  const fullPage = new SharedLayoutView(pageContent).render();
  res.send(fullPage);
});

export default router;