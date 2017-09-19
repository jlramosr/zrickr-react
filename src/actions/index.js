export const ADD_CLIENT = 'ADD_CLIENT';

export function addClient ({ name }) {
  return {
    type: ADD_CLIENT,
    name
  }
}