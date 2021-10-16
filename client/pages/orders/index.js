import Link from 'next/link';
import useRequest from '../../hooks/use-request';

const Orders = ({ orders }) => (
  <>
    <h1>My orders</h1>
    <table className='table'>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map(order => (
          <tr key={order.ticket.id}>
            <td>
              <Link
                href='./tickets/[ticketId]'
                as={`/tickets/${order.ticket.id}`}
              >
                <a className='nav-link'>{order.ticket.title}</a>
              </Link>
            </td>
            <td>{order.ticket.price}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

Orders.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get('/api/orders');
  console.log({ orders });
  return { orders };
};

export default Orders;
