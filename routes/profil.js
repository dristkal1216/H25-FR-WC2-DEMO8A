import express from "express";
import SharedLayoutView from "#views/shared/layout.js";
import ProfileView from "#views/profil/index.js";

const router = express.Router();

// Page profil protégée
router.get(["/", "/index"], (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const pageContent = new ProfileView().render();
  if (req.get("X-Requested-With") === "XMLHttpRequest") {
    return res.send(pageContent);
  }
  const fullPage = new SharedLayoutView(pageContent).render();
  res.send(fullPage);
});

export default router;
