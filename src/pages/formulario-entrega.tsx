import DeliveryForm from '../components/delivery-form';
import React from 'react';
import Navbar from '../components/navbar';

const EntregaFormsPage: React.FC = () => {
  return (
    <div>
        <Navbar />
        <br/>
        <DeliveryForm />
    </div>
  );
};

export default EntregaFormsPage;