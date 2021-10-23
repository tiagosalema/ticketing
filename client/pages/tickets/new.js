import { useCallback, useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const handleSetTitle = useCallback(ev => {
    setTitle(ev.target.value);
  }, []);
  const handleSetPrice = useCallback(ev => {
    setPrice(ev.target.value);
  }, []);

  const onBlur = useCallback(() => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  }, [price]);

  const onSubmit = e => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <div>
            <label htmlFor=''>
              Title
              <input
                value={title}
                onChange={handleSetTitle}
                className='form-control'
              />
            </label>
          </div>
          <div className='my-2'>
            <label htmlFor=''>
              Price{' '}
              <input
                value={price}
                onBlur={onBlur}
                onChange={handleSetPrice}
                className='form-control'
              />
            </label>
          </div>
          <button className='btn btn-primary'>Create ticket</button>
        </div>
      </form>
      {errors}
    </div>
  );
};

export default NewTicket;
