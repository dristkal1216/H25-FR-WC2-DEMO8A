class View {
    /**
     * Génère une chaîne de contenu HTML à partir des littéraux et des variables fournis.
     * @param {TemplateStringsArray} literals - Les chaînes littérales provenant d'une string interpolée.
     * @param  {...any} vars - Les parties variables provenant d'une string interpolée.
     * @returns {string} Le contenu HTML généré.
     */
    static html(literals, ...vars) {
        let resultArray = [literals[0]];

        for (let i = 0, len = vars.length; i < len; i++) {
            resultArray.push(vars[i], literals[i + 1]);
        }
        
        let result = resultArray
            .join('')
            .replace(/[\n\r]+/g, '')
            .replace(/>\s{2,}</g, '> <')
            .trim();

        return result;
    }

    /**
     * Creation secure de fragment HTML
     * @param {string} text - Le texte pour lequel échapper les séquences HTML
    */
    static escapeHTML(text) {
        return text.replace(/[&<>"']/g, match => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;',
            '"': '&quot;', "'": '&#39;'
        }[match]));
    }

    /**
     * Les Views qui utilisent un conteneur doivent avoir ce marqueur
     * afin que la méthode render place le contenu du template au bon endroit.
     * @type {string}
     */
    static bodyMarker = "[[BODY]]";

    /**
     * La fonction à utiliser pour le contenu html. Il est recommendé d'utiliser la
     * méthode {@link View.html} devant la chaîne interpolée.
     * @example
     * template = (data) =­­> View.html` 
     * <h1> Titre </h1>
     * `;
     * @type {function}
     */
    template;

    /**
     * Les données que la méthode render utilisera pour le template.
     * @type {string|Array|Object}
     */
    data;

    /**
     * Doit contenir le View.bodyMarker quelque part pour afficher le corps de la vue.
     * @type {string|null}
     */
    container;

    /**
     * @param {string|Array|Object} data
     * @param {function(*): string} template
     * @param {string|null} container
     */
    constructor(template, data = null, container = null) {
        this.template = template;
        this.data = data;
        this.container = container;
    }

    /**
     * Génère la vue à partir du template et du conteneur fournis.
     * @returns {string} La vue générée sous forme de chaîne de caractères.
    */
    render() {
        const body = this.renderBody();
        return this.container ? this.container.replace(View.bodyMarker, body) : body;
    }

    /**
     * Génère le corps de la vue (pas le conteneur) à partir du template fourni.
     * S'il n'y a pas de template, data sera retourné si existe, sinon la châine
     * "Rien à afficher" sera retourné. 
     * @returns {string} La vue générée sous forme de chaîne de caractères.
    */
    renderBody() {
        if (!this.template) {
            console.log("Template manquant!");
            return this.data || "Rien à afficher";
        }
        return Array.isArray(this.data) 
            ? this.data.map(item => this.template(item)).join('')
            : this.template(this.data);     
    }

    escapeHTML(text) {
        return text.replace(/[&<>"']/g, (match) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[match]);
    }
}

export default View;