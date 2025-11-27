import React, { useState, useEffect } from 'react';
import './ServizioForm.css';

export function ServizioForm({ 
  servizio = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) {
  const [formData, setFormData] = useState({
    nome: '',
    descrizione: '',
    prezzo: '',
    durata: '',
    categoria: '',
    attivo: true
  });

  useEffect(() => {
    if (servizio) {
      setFormData({
        nome: servizio.nome || '',
        descrizione: servizio.descrizione || '',
        prezzo: servizio.prezzo || '',
        durata: servizio.durata || '',
        categoria: servizio.categoria || '',
        attivo: servizio.attivo !== undefined ? servizio.attivo : true
      });
    }
  }, [servizio]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      prezzo: parseFloat(formData.prezzo),
      durata: formData.durata ? parseInt(formData.durata) : null,
      categoria: formData.categoria || null
    };

    await onSubmit(submitData);
  };

  const categoriePredefinite = [
    'Estetica',
    'Pedicure',
    'Manicure',
  ];

  return (
    <form onSubmit={handleSubmit} className="servizio-form">
      <div className="form-group">
        <label className="form-label">Nome Servizio *</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="form-control"
          disabled={loading}
          placeholder="Es: Manicure Classica"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descrizione</label>
        <textarea
          name="descrizione"
          value={formData.descrizione}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
          placeholder="Descrizione dettagliata del servizio..."
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Prezzo (€) *</label>
          <input
            type="number"
            name="prezzo"
            value={formData.prezzo}
            onChange={handleChange}
            required
            className="form-control"
            disabled={loading}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Durata (minuti)</label>
          <input
            type="number"
            name="durata"
            value={formData.durata}
            onChange={handleChange}
            className="form-control"
            disabled={loading}
            placeholder="60"
            min="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Categoria</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          className="form-control"
          disabled={loading}
        >
          <option value="">Seleziona categoria</option>
          {categoriePredefinite.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            name="attivo"
            checked={formData.attivo}
            onChange={handleChange}
            disabled={loading}
          />
          <span className="checkbox-label">Servizio attivo</span>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={loading}
        >
          Annulla
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {servizio ? 'Aggiorna Servizio' : 'Crea Servizio'}
        </button>
      </div>
    </form>
  );
}