'use client'

import React from 'react';
import useCreateEvent from './useCreateEvent';
import Image from 'next/image';

interface CreateEventProps {
  isLoading: boolean;
  weather: string;
  weatherUrl: string;
  error: string;
  title: string;
  description: string;
  city: string;
  startDate: string;
  isAllDay: boolean;
  finishDate: string;
  onClose: () => void;
  changeTitle: () => void;
  changeDescription: () => void;
  changeCity: () => void;
  changeStartDate: () => void;
  changeAllDay: () => void;
  changeFinishDate: () => void;
  onCreate: () => void;
  operationLabel?: string;
  buttonLabel: string;
  isValidForm: boolean;
  isDelete: boolean;
  onDelete: () => void;
};

export const CreateEvent = ({
  isLoading = false,
  weather = '',
  weatherUrl = '',
  error = '',
  title = '',
  description = '',
  city = '',
  startDate = '',
  isAllDay = false,
  finishDate = '',
  changeTitle = () => { },
  changeDescription = () => { },
  changeCity = () => { },
  changeStartDate = () => { },
  changeAllDay = () => { },
  changeFinishDate = () => { },
  onCreate = () => { },
  onClose = () => { },
  operationLabel = 'Crear Evento',
  buttonLabel = '¡Crear ahora!',
  isValidForm = false,
  isDelete = false,
  onDelete = () => { },
}: CreateEventProps) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-row">
          <div>
            <h2 className="text-lg font-semibold">{operationLabel}</h2>
            { <div className="text-xs">{weather || ( city ? "Cargando clima..." : "Aquí podrás conocer el clima" )}</div> }
          </div>
          { !!weatherUrl && (
              <div className="pl-2">
                <Image
                    src={`https://${weatherUrl}`}
                    alt={weather}
                    width={50}
                    height={50}
                    layout="fixed"
                />
              </div>
          )}
        </div>
        {isDelete && <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
            type="button"
        >
          Borrar
        </button>}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <div className="mb-4">
          <label className="block mb-1">Título:</label>
          <input
              type="text"
              className="border border-gray-300 p-2 w-full rounded"
              value={title}
              onChange={changeTitle}
              required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Descripción:</label>
          <textarea
              className="border border-gray-300 p-2 w-full rounded"
              value={description}
              onChange={changeDescription}
              required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Ciudad:</label>
          <input
              className="border border-gray-300 p-2 w-full rounded"
              value={city}
              onChange={changeCity}
              required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Fecha de Inicio:</label>
          <input
              type="datetime-local"
              className="border border-gray-300 p-2 w-full rounded"
              value={startDate}
              onChange={changeStartDate}
              required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
              type="checkbox"
              checked={isAllDay}
              onChange={changeAllDay}
              className="mr-2"
          />
          <label>Todo el día</label>
        </div>
        {!isAllDay && (
            <div className="mb-4">
              <label className="block mb-1">Fecha de Finalización:</label>
              <input
                  type="datetime-local"
                  className="border border-gray-300 p-2 w-full rounded"
                  value={finishDate}
                  min={startDate}
                  onChange={changeFinishDate}
              />
            </div>
        )}
        <button
            onClick={onCreate}
            disabled={!isValidForm}
            className={`${isValidForm ? 'bg-blue-500' : 'bg-gray-500'} text-white p-2 rounded w-full`}
        >
          {buttonLabel}
        </button>
      </div>
      <button onClick={onClose} className="mt-4 text-gray-500">
        Cancelar
      </button>
    </div>
  </div>
);

export default (props) => {
  const hook = useCreateEvent(props);
  return <CreateEvent {...hook} />;
};
