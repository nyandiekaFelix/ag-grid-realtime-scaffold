import { useState, useEffect, useRef, useCallback } from 'react';
import type { WebSocketMessage } from '../types';

export const useWebSocket = (url: string) => {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Reconnect logic with exponential backoff could go here
      // For now, simple retry every 3s
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error', error);
      wsRef.current?.close();
    };

  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);


  const close = useCallback(() => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    wsRef.current?.close();
  }, []);

  return { lastMessage, isConnected, close, connect };
};
