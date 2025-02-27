import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

// Define the type of value expected for validation
function Validate(value: string): boolean {
  // Check if the value contains only numeric characters
  const isNumeric = /^\d+$/.test(value);
  return isNumeric;
};

function  NumberWithCommas( number: number ) : string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};



export {Validate, NumberWithCommas};

interface SessionData {
  sessionId: string;
  userId: string;
}


export const useEncryptedStorage = (key: string, initialValue: string | null) => {
  const [value, setValue] = useState<string | null>(initialValue);
  const [cookies, setCookie, removeCookie] = useCookies([key]);

  useEffect(() => {
   
    const storedValue = cookies[key];
    if (storedValue) {
     
      setValue(storedValue);
    }
  }, [key, cookies]);

  const saveValue = (newValue: string) => {
    setCookie(key, newValue);
    setValue(newValue);
  };

  const removeValue = () => {
    removeCookie(key);
    setValue(null);
  };
 
  return [value, saveValue, removeValue];
};

export const useInMemorySessionStorage = () => {
  const [sessions, setSessions] = useState<Record<string, SessionData>>({});

  const setSession = (session: SessionData) => {
    setSessions((prevSessions) => ({
      ...prevSessions,
      [session.sessionId]: session, 
    }));
  };
  
  const getSession = (sessionId: string): SessionData | undefined => {    
    return sessions[sessionId];
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prevSessions) => {
      const newSessions = { ...prevSessions };
      delete newSessions[sessionId];
      return newSessions;
    });
  };

  return {
    setSession,
    getSession,
    deleteSession,
  };
};


 