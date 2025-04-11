import View from '#core/View.js';
import Item from '#models/item.js';

class ItemsIndexView extends View {
    static conteneur = View.html`
        <table data-data-for="items">
            <thead>
                <tr>
                    <th style="width:35%"> Nom </th>
                    <th style="width:35%"> Description </th>
                    <th style="width:20%"> Poids </th>
                </tr>
            </thead>
            <tbody>
                [[BODY]]
            </tbody>
        </table>
    `;
    /** @param {Item} item */
    static template = (item) => View.html`
        <tr data-id=${item.id}>
            <td style="max-width:35%" class="td-input" data-key="nom" data-input="text"> ${item.nom} </td>
            <td style="max-width:35%" class="td-input" data-key="description" data-input="textarea"> ${item.description} </td>
            <td style="max-width:20%" class="td-input" data-key="poids" data-input="number" data-min="0" data-step="0.5"> ${Number(item.poids).toFixed(1)} </td>
            <td style="max-width:5%" class="btn-inside"> <span class="btn-modify"> ✏️ </span> </td>
            <td style="max-width:5%" class="btn-inside"> <span class="btn-delete"> 🗑️ </span> </td>
        </tr>
    `;

    constructor(items){
        super(ItemsIndexView.template, items, ItemsIndexView.conteneur);
    }
}

export default ItemsIndexView;