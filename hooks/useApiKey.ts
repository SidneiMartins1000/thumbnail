import { useState, useEffect, useCallback } from 'react';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

export const useApiKey = (): [string | null, (key: string) => void, () => void] => {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    try {
      // Get initial key from localStorage synchronously to avoid flash of content
      return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Aviso: Não foi possível acessar o localStorage. A chave de API não será persistida.", error);
      return null;
    }
  });

  const saveApiKey = useCallback((key: string) => {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch (error) {
       console.error("Aviso: Não foi possível salvar a chave de API no localStorage.", error);
    }
    setApiKey(key);
  }, []);

  const clearApiKey = useCallback(() => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
       console.error("Aviso: Não foi possível remover a chave de API do localStorage.", error);
    }
    setApiKey(null);
  }, []);

  // This effect will sync the state if localStorage is changed in another tab
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === API_KEY_STORAGE_KEY) {
        setApiKey(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return [apiKey, saveApiKey, clearApiKey];
};