import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (params = {}) => {
    try {
      setErrors(null);
      const res = await axios[method](url, { ...body, ...params });

      if (onSuccess) {
        onSuccess(res.data);
      }

      return res.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className='alert alert-danger'>
          <h4>Oops...</h4>
          <ul className='my-0'>
            {err.response.data.errors.map(error => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
