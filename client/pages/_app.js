import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className='container mt-5'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </>
  );
};

// when getInitialProps is invoked in the _app component, no other
// component will have its getInitialProps function called by default.
// For that reason, this function will be manually invoked in the if statement
AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  const childGetInitialProps = appContext.Component.getInitialProps;
  let pageProps =
    (await childGetInitialProps?.(appContext.ctx, client, data.currentUser)) ||
    {};

  return { pageProps, ...data };
};

export default AppComponent;
