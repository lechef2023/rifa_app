import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { firestore } from './firebase';

function MyForm() {
  const [formData, setFormData] = useState({
    numerosSeleccionados: [],
    fechaCompra: '',
    nombreCompleto: '',
    correoElectronico: '',
    ubicacion: 'Carabobo',
    metodoPago: 'Pago móvil',
    numeroReferencia: '',
  });

  const [numerosDisponibles, setNumerosDisponibles] = useState(
    Array.from({ length: 1000 }, (_, index) => {
      return { numero: index, seleccionado: false };
    })
  );

  useEffect(() => {
    // Consultar la base de datos para obtener números previamente seleccionados
    const fetchSelectedNumbers = async () => {
      try {
        const snapshot = await firestore.collection('formData').get();
        snapshot.forEach((doc) => {
          const data = doc.data();
          const selectedNumbers = data.numerosSeleccionados;
          const nuevosNumerosDisponibles = [...numerosDisponibles];
          selectedNumbers.forEach((numero) => {
            if (numero < nuevosNumerosDisponibles.length) {
              nuevosNumerosDisponibles[numero].seleccionado = true;
            }
          });
          setNumerosDisponibles(nuevosNumerosDisponibles);
        });
      } catch (error) {
        console.error('Error al consultar la base de datos: ', error);
      }
    };
    fetchSelectedNumbers();
  }, [numerosDisponibles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "numeroSeleccionado") {
      const numero = parseInt(value);
      const nuevosNumerosSeleccionados = [...formData.numerosSeleccionados];

      if (!nuevosNumerosSeleccionados.includes(numero)) {
        nuevosNumerosSeleccionados.push(numero);
      }

      const nuevosNumerosDisponibles = [...numerosDisponibles];
      const numeroSeleccionadoIndex = nuevosNumerosDisponibles.findIndex(
        (num) => num.numero === numero
      );

      if (numeroSeleccionadoIndex !== -1) {
        nuevosNumerosDisponibles[numeroSeleccionadoIndex].seleccionado = true;
      }

      setFormData({ ...formData, numerosSeleccionados: nuevosNumerosSeleccionados });
      setNumerosDisponibles(nuevosNumerosDisponibles);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Guardar los datos en la base de datos
      const docRef = await firestore.collection('formData').add(formData);

      // Marcar números seleccionados como inactivos en la base de datos
      const selectedNumbers = formData.numerosSeleccionados;
      const nuevosNumerosDisponibles = [...numerosDisponibles];
      selectedNumbers.forEach((numero) => {
        nuevosNumerosDisponibles[numero].seleccionado = true;
      });

      // Actualizar la lista de números seleccionados
      setNumerosDisponibles(nuevosNumerosDisponibles);

      // Reiniciar el formulario
      e.target.reset();
      setFormData({ ...formData, numerosSeleccionados: [] });
    } catch (error) {
      console.error('Error al guardar el documento: ', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form onSubmit={handleSubmit} style={{ width: '300px', textAlign: 'center' }}>
        <Form.Group controlId="numeroSeleccionado">
          <Form.Label>Selecciona un número (00-999)</Form.Label>
          <Form.Control as="select" name="numeroSeleccionado" onChange={handleChange}>
            <option value="">Selecciona un número</option>
            {numerosDisponibles.map((num) => (
              <option
                key={num.numero}
                value={num.numero}
                disabled={num.seleccionado}
              >
                {num.numero < 10 ? `00${num.numero}` : num.numero < 100 ? `0${num.numero}` : num.numero}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {formData.numerosSeleccionados.map((numero) => (
            <div key={numero} style={{ margin: '4px', background: 'red', color: 'white', padding: '4px' }}>
              {numero < 10 ? `00${numero}` : numero < 100 ? `0${numero}` : numero}
            </div>
          ))}
        </div>

        <Form.Group controlId="fechaCompra">
          <Form.Label>Fecha de Compra (YYYY-MM-DD)</Form.Label>
          <Form.Control
            type="date"
            name="fechaCompra"
            value={formData.fechaCompra}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="nombreCompleto">
          <Form.Label>Nombre Completo</Form.Label>
          <Form.Control
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            pattern="^[A-Za-z\s]+$"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="correoElectronico">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="correoElectronico"
            value={formData.correoElectronico}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="ubicacion">
          <Form.Label>Ubicación</Form.Label>
          <Form.Control as="select" name="ubicacion" onChange={handleChange}>
            <option value="Carabobo">Carabobo</option>
            <option value="Aragua">Aragua</option>
            <option value="Cojedes">Cojedes</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="metodoPago">
          <Form.Label>Método de Pago</Form.Label>
          <Form.Control as="select" name="metodoPago" onChange={handleChange}>
            <option value="Pago móvil">Pago móvil</option>
            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
            <option value="Efectivo">Efectivo</option>
          </Form.Control>
        </Form.Group>

        {formData.metodoPago === 'Pago móvil' || formData.metodoPago === 'Transferencia Bancaria' ? (
          <Form.Group controlId="numeroReferencia">
            <Form.Label>Número de Referencia (4 dígitos)</Form.Label>
            <Form.Control
              type="text"
              name="numeroReferencia"
              value={formData.numeroReferencia}
              pattern="^\d{4}$"
              onChange={handleChange}
            />
          </Form.Group>
        ) : null}

        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </div>
  );
}

export default MyForm;
