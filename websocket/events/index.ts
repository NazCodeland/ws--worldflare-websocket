import { WebSocket } from 'ws';
import handleUserEvents from './userEvents';

export default function handleAllEvents(socket: WebSocket) {
	handleUserEvents(socket);
	// handleNpcEvents(socket);
	// Add more event handlers as needed...
}
