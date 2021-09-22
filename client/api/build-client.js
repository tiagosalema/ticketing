import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // this code executes on the server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // this code executes on the client
    return axios.create({
      baseURL: '/',
    });
  }
};

export default buildClient;
