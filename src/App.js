import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import { AppProvider } from "./AppContext";


import './assets/App.css';


import Home from './routes/Home';

import Shop from './routes/shop';

import Product from './routes/product';
import Saves from './routes/saves';

import Orders from './routes/orders';

import CheckOut from './routes/checkout';


import Settings from './routes/Settings';
import Control from './routes/control';


import Join from './routes/signup';
import Auth_Login from './routes/signin';

import Terms from './routes/terms';
import About from './routes/About';
import Contact from './routes/Contact';

import NotFound from './routes/NotFound';


import userState from './response/res-auth.js';
import footerApp from './routes/appComp/footer.js';



function App() {
  return (
    <AppProvider>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Auth_Login />} />
          <Route path="/product/:name_product" element={<Product />} />
          <Route path="/saves" element={<Saves />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/control" element={<Control />} />
          <Route path="/shop/" element={<Shop />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router >
    </AppProvider>

  );
}

export default App;
