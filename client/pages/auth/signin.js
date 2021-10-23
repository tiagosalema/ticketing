import { useState } from 'react';

import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async e => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className='form-group'>
        <div>
          <label>
            Email Address
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='form-control'
            />
          </label>
        </div>
        <div className='my-2'>
          <label>
            Password
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type='password'
              className='form-control'
            />
          </label>
        </div>
        <button className='btn btn-primary'>Sign in</button>
      </div>
      {errors}
    </form>
  );
};

export default Signin;
