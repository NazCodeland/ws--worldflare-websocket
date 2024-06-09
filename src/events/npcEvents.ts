import { WebSocket } from 'ws';

export default function handleNpcEvents(socket: WebSocket): void {
	socket.on('message', (message) => {});
}
