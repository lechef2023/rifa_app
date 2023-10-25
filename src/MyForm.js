import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { firestore } from './firebase';

function MyForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await firestore.collection('formData').add(formData);
      console.log('Documento guardado con ID: ', docRef.id);
      // Puedes añadir más lógica aquí, como limpiar el formulario o redirigir al usuario.
    } catch (error) {
      console.error('Error al guardar el documento: ', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="name">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Enviar
      </Button>
    </Form>
  );
}

export default MyForm;
