import DeliveryList from '../components/delivery-list';
import React from 'react';
import Navbar from '../components/navbar';

const entregasPage: React.FC = () => {
  return (
    <div>
        <Navbar />
        <br/>
        <DeliveryList />
    </div>
  );
};

export default entregasPage;