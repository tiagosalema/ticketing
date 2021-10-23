import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [minLeft, setMinLeft] = useState(0);
  const [secLeft, setSecLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const timeLeft = (new Date(order.expiresAt) - new Date()) / 1000;
      const minutesLeft = timeLeft / 60;
      const minLeft = Math.floor(minutesLeft);
      const secLeft = Math.floor((minutesLeft - minLeft) * 60);
      setMinLeft(minLeft);
      setSecLeft(secLeft);
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, []);

  if (minLeft < 0) return <div>Order Expired.</div>;

  return (
    <div>
      <p>
        Time left until order expires: {minLeft}:
        {secLeft.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
      </p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51JkXGYB5FXVBLraOK72qETTLzV4ux0VGdjYC1rFf393HTwrbwBN43p0JsCS7gxBp8vJ3mGPF0lonjQUu6IUulS8p00NQyRRQEw'
        amount={order.ticket.price * 100}
        email={currentUser.email}
        currency='gbp'
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);
  return { order };
};

export default OrderShow;
