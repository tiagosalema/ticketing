import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => (
  <>
    <h1>Tickets</h1>;
    <table className='table'>
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map(ticket => (
          <tr key={ticket.id}>
            <td>
              <Link href='./tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
                <a className='nav-link'>{ticket.title}</a>
              </Link>
            </td>
            <td>{ticket.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: tickets } = await client.get('/api/tickets');
  return { tickets };
};

export default LandingPage;
