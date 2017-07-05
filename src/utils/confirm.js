import { createConfirmation } from 'react-confirm';
import ComplexConfirmation from '../component/ConfirmationComplex';
import AddSeries from '../component/addSeries';
import Confirmation from '../component/Confirmation';

 
// create confirm function 

const defaultConfirmation = createConfirmation(Confirmation);

export function confirm(confirmation, options = {}) {
  console.log(confirmation,options)
  return defaultConfirmation({ confirmation, ...options });
}

export const confirmComplex = createConfirmation(ComplexConfirmation);
export const addSeries = createConfirmation(AddSeries);