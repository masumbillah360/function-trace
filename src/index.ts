import { TraceOptions, TraceStats } from "./types";

export function trace<F extends (...args: any[]) => any>(
    fn: F,
    options: TraceOptions = {}
): F & { stats: TraceStats } {
    const { log = false, maxHistory = 50 } = options;
    const stats: TraceStats = { calls: 0, errors: 0, lastTime: 0, history: [] };

    const wrapped = ((...args: Parameters<F>) => {
        const start = performance.now ? performance.now() : Date.now();
        stats.calls += 1;

        try {
            const result = fn(...args);

            if (result instanceof Promise) {
                return result
                    .then((res) => {
                        const end = performance.now
                            ? performance.now()
                            : Date.now();
                        stats.lastTime = end - start;
                        stats.history.push(stats.lastTime);
                        if (stats.history.length > maxHistory)
                            stats.history.shift();
                        if (log)
                            console.log(
                                `[func-trace] ${
                                    fn.name || 'anonymous'
                                } executed in ${stats.lastTime.toFixed(2)}ms`
                            );
                        return res;
                    })
                    .catch((err) => {
                        stats.errors += 1;
                        throw err;
                    });
            } else {
                const end = performance.now ? performance.now() : Date.now();
                stats.lastTime = end - start;
                stats.history.push(stats.lastTime);
                if (stats.history.length > maxHistory) stats.history.shift();
                if (log)
                    console.log(
                        `[func-trace] ${
                            fn.name || 'anonymous'
                        } executed in ${stats.lastTime.toFixed(2)}ms`
                    );
                return result;
            }
        } catch (err) {
            stats.errors += 1;
            throw err;
        }
    }) as F & { stats: TraceStats };

    wrapped.stats = stats;
    return wrapped;
}
