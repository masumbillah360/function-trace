export interface TraceOptions {
    log?: boolean;
    maxHistory?: number; // keep last N execution times
}

export interface TraceStats {
    calls: number;
    errors: number;
    lastTime: number;
    history: number[];
}
