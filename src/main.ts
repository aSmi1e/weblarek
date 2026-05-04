import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/Models/Catalog';

const catalog = new Catalog();
catalog.saveProducts(apiProducts.items);

const prod = catalog.getProductById('b06cde61-912f-4663-9751-09956c0eed67');
console.log(prod);