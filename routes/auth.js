// routes/auth.js
import express from "express";
const router = express.Router();

router.get(['/','/view','/view/index'], (req, res) => {
  if (!req.session.user) return res.status(401).end();
  res.json({ user: req.session.user });
});

router.put(['/','/view','/view/index'], async (req, res) => {
    // 1️⃣ Ensure logged in
    if (!req.session.user) {
      return res.sendStatus(401);
    }
  
    // 2️⃣ Pull the new list from the body
    const { favourites } = req.body;
    if (!Array.isArray(favourites)) {
      return res.status(400).json({ error: "Invalid payload" });
    }
  
    // 3️⃣ Read all users, find the current one
    const allUsers = await usersStore.read();
    const me = allUsers.find(u => u.id === req.session.user.id);
    if (!me) {
      return res.sendStatus(404);
    }
  
    // 4️⃣ Update and write back
    me.favourites = favourites;
    await usersStore.write(allUsers);
  
    // 5️⃣ Optionally update session copy
    req.session.user.favourites = favourites;
  
    // 6️⃣ Done!
    res.sendStatus(204);
  });

export default router;
