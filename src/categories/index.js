import Client from './Clients';
import Work from 'material-ui-icons/Work';
import Movement from './Movements';
import CreditCard from 'material-ui-icons/CreditCard';
import Invoice from './Invoices';
import PictureAsPdf from 'material-ui-icons/PictureAsPdf';

export default [
  { name:'clients', label:'Clientes', component:Client, icon:Work },
  { name:'movements', label:'Movimientos', component:Movement, icon:CreditCard },
  { name:'invoices', label: 'Facturas', component: Invoice, icon:PictureAsPdf }
]