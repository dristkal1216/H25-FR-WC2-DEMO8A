import express from 'express';
import { itemsStore } from '#core/data-stores/index.js';
import ItemsIndexView from '#views/items/index.js';
import SharedLayoutView from '#views/shared/layout.js';

const router = express.Router();

router.get(['/', '/view', 'view/index'], async(req, res, next) => {    
    const items = await itemsStore.read();
    const pageContent = new ItemsIndexView(items).render();

    if (req.get('X-Requested-With') === 'XMLHttpRequest') {
        return res.json(items);
    }
        
    const fullPage = new SharedLayoutView(pageContent).render();
    res.send(fullPage);
});

router.patch(['/:id', '/update/:id'], async(req,res,next) => {
    try {
        const id = parseInt(req.params.id);
        const patchData = req.body;
        const items = await itemsStore.read();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const updatedItem = { ...items[index], ...patchData };
        items[index] = updatedItem;
        await itemsStore.write(items);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete(['/:id', '/delete/:id'], async(req,res,next) => {
    try {
        const id = parseInt(req.params.id);
        const patchData = req.body;
        const items = await itemsStore.read();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const deletedItem = items.splice(index, 1)[0];
        await itemsStore.write(items);
        res.json(deletedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;