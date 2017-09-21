import Client from '../../Clients';
import Briefcase from 'react-icons/lib/fa/briefcase';
import Movement from '../../Movements';
import Money from 'react-icons/lib/fa/money';
import Invoice from '../../Invoices';
import FilePDFO from 'react-icons/lib/fa/file-pdf-o';

export default [
  { name:'clients', label:'Clientes', itemLabel:'Cliente', component:Client, icon:Briefcase },
  { name:'movements', label:'Movimientos', itemLabel:'Movimiento', component:Movement, icon:Money },
  { name:'invoices', label: 'Facturas', itemLabel:'Factura', component: Invoice, icon:FilePDFO }
]