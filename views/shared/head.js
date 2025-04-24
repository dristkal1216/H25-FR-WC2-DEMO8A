import View from "#core/view.js";

class SharedHeadView extends View {
  static template = () => View.html`
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="/css/styles.css">
        <script type="module" src="/js/client-app.js"></script>
    </head>
    `;

  constructor() {
    super(SharedHeadView.template);
  }
}

export default new SharedHeadView();
