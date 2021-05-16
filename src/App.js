import React, {Component, useEffect} from 'react';
import {Root, Routes, Head} from 'react-static';
import {Route, Switch} from 'react-router-dom';

import './app.css';
import colors from './utils/colors';
import {MobileNav} from './components/Nav';
import useScript from './utils/hooks/useScript';
import './tachyons.min.css';

const Loading = () => {
  // loading can be more juicy
  return (<div></div>)
};

const App = () => {
  useEffect(() => {
    if (window.netlifyIdentity) {
      setTimeout(() => {
	window.netlifyIdentity.on("init", user => {
	  if (!user) {
            window.netlifyIdentity.on("login", () => {
              document.location.href = "/admin/";
            });
	  }
	});
      }, 0)
    }
  });

  return (<Root>
	    {process.env.NODE_ENV !== "development" &&
	     <Head>
	       <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
	       <script>var clicky_site_ids = clicky_site_ids || []; clicky_site_ids.push(101233643);</script>
	       <script async src="https://static.getclicky.com/js"></script>
	     </Head>}

	    <React.Suspense fallback={<Loading />}>
	      <Switch>
		<Route component={Routes} />
	      </Switch>
	    </React.Suspense>
	  </Root>)
};

export default App;
