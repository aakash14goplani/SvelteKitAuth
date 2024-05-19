import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = ({ error, message, status }) => {
  const _message = `Error caught in [client-hooks]: ${(error as any)?.message}`;
  console.log({ error, message, status, custom_message: _message });
  return { message: _message };
};
