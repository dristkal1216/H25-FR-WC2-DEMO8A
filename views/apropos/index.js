import View from "#core/view.js";

class AproposIndexView extends View {
  static template = () => View.html`
        <h1 class="apropos-title">À Propos</h1>
        <p class="apropos-text">
            Cette application a été conçue pour offrir aux joueurs de <strong>League of Legends</strong> un outil simple et efficace 
            pour explorer et analyser les champions du jeu. Que vous soyez un joueur débutant souhaitant découvrir de nouveaux champions
            ou un joueur expérimenté cherchant à approfondir ses connaissances, cette plateforme est faite pour vous.
        </p>
        <p class="apropos-text">
            <strong>Fonctionnalités principales :</strong>
        </p>
        <ul class="apropos-list">
            <li>🔎 <strong>Explorer les champions</strong> : Accédez à une base de données complète des champions avec leurs rôles et descriptions.</li>
            <li>⭐ <strong>Ajouter aux favoris</strong> : Gardez une liste des champions que vous aimez pour un accès rapide.</li>
            <li>📊 <strong>Analyse des rôles</strong> : Visualisez les classes des champions pour trouver celui qui correspond à votre style de jeu.</li>
            <li>⚡ <strong>Interface intuitive</strong> : Profitez d'une navigation fluide et rapide grâce à un design optimisé.</li>
        </ul>
        <p class="apropos-text">
            <strong>À propos du développeur :</strong>
        </p>
        <p class="apropos-text" id="author-info">
          Je suis une étudiante passionnée de jeux vidéo et je joue à League of Legends depuis maintenant 10 ans. Ce jeu m'a accompagné
          à travers les années et m'a donné envie de créer du contenu utile pour la communauté.
          Dans mon apprentissage de la programmation, je cherche constamment à m’améliorer afin de, un jour, concevoir un site qui aidera les joueurs à mieux comprendre le jeu, 
          analyser leurs performances et explorer les champions de manière plus intuitive.
          Ce projet, réalisé dans le cadre du cours WC2, m’a permis d’approfondir mes compétences en développement web et de découvrir DDragon, une base de données regroupant 
          les assets officiels de League of Legends. En utilisant l'API des champions, j’ai pu concevoir ce site avec une interface fluide et dynamique, 
          permettant d’explorer les différents personnages du jeu et de les ajouter aux favoris.
          Ce travail a été une expérience enrichissante, me donnant une meilleure compréhension de l'intégration des API et de la gestion des données en JavaScript. J’espère 
          que ce site vous sera utile et qu’il vous aidera à mieux connaître les champions de League of Legends ! 😊
        </p>`;

  constructor() {
    super(AproposIndexView.template);
  }
}

export default AproposIndexView;
