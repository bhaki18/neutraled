/**
 * @description Wrapper per Web Serial API — comunicazione con Arduino Joystick.
 *              Protocollo: JSON newline-delimited @ 115200 baud.
 *              Supportato da Chrome/Edge 89+. Non funziona su Firefox/Safari.
 *
 * Formato messaggi Arduino → browser:
 *   {"type":"state","t":4821,"player":1,"axes":{"x":0.47,"y":-0.12},"btns":[1,0,0,1]}
 *   {"type":"config","btns":4,"deadzone":0.05,"rate":20,"player":1,"fw":"1.0.0"}
 *   {"type":"pong","t":13405}
 *   {"type":"error","code":"parse_fail","t":...}
 */
export class ArduinoSerialBridge {
    port = null;
    reader = null;
    writer = null;
    buffer = '';
    listeners = {};
    static get isSupported() {
        return 'serial' in navigator;
    }
    /** Apre il dialog browser per selezionare la porta seriale. Richiede gesto utente. */
    async connect(baudRate = 115200) {
        const serial = navigator.serial;
        this.port = await serial.requestPort();
        await this.port.open({ baudRate });
        // Pipeline: porta → TextDecoderStream → reader
        const decoder = new window.TextDecoderStream();
        this.port.readable.pipeTo(decoder.writable);
        this.reader = decoder.readable.getReader();
        this.writer = this.port.writable.getWriter();
        this._readLoop();
    }
    async disconnect() {
        try {
            await this.reader?.cancel();
            await this.writer?.close?.();
            await this.port?.close();
        }
        catch { /* ignora errori di chiusura */ }
        this.port = this.reader = this.writer = null;
    }
    async _readLoop() {
        try {
            while (true) {
                const result = await this.reader.read();
                if (result.done)
                    break;
                this.buffer += result.value;
                let nl;
                while ((nl = this.buffer.indexOf('\n')) !== -1) {
                    const line = this.buffer.slice(0, nl).trim();
                    this.buffer = this.buffer.slice(nl + 1);
                    if (line)
                        this._dispatch(line);
                }
            }
        }
        catch (e) {
            console.warn('[ArduinoSerialBridge] read error:', e);
        }
    }
    _dispatch(line) {
        try {
            const msg = JSON.parse(line);
            const type = msg['type'];
            if (type && this.listeners[type]) {
                this.listeners[type].forEach((fn) => fn(msg));
            }
        }
        catch { /* ignora JSON malformati */ }
    }
    on(type, fn) {
        (this.listeners[type] ??= []).push(fn);
        return this;
    }
    async send(obj) {
        if (!this.writer)
            return;
        const bytes = new TextEncoder().encode(JSON.stringify(obj) + '\n');
        await this.writer.write(bytes);
    }
    // ── Shortcut comandi verso Arduino ────────────────────────────────────────
    getConfig() { return this.send({ cmd: 'get_config' }); }
    setConfig(opts) { return this.send({ cmd: 'set_config', ...opts }); }
    getState() { return this.send({ cmd: 'get_state' }); }
    ping() { return this.send({ cmd: 'ping', t: performance.now() | 0 }); }
    setPlayer(id) { return this.send({ cmd: 'set_player', id }); }
    rumble(duration = 200, strength = 1.0) { return this.send({ cmd: 'rumble', duration, strength }); }
}
