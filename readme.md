# func-trace

> A tiny universal function profiler and logger for full-stack developers. Trace execution time, monitor function calls, and track errors with zero configuration.

![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-0.1.0-success.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## Features

✨ **Lightweight** - Minimal overhead, perfect for production  
⚡ **Universal** - Works with sync and async functions  
📊 **Performance Tracking** - Automatic execution time measurement  
📈 **Statistics** - Built-in call counts, error tracking, and history  
🎨 **Beautiful Output** - Color-coded console logging  
📦 **Zero Dependencies** - Pure TypeScript, no external packages  
🔧 **Type-Safe** - Full TypeScript support with proper type inference  

## Installation

```bash
npm install func-trace
```

## Quick Start

### Basic Usage

```typescript
import { trace } from 'func-trace';

// Wrap any function with trace
const add = trace((a: number, b: number) => a + b, { log: true });

const result = add(5, 3);
// Output: [func-trace] anonymous executed in 0.05ms

console.log(add.stats); // { calls: 1, errors: 0, lastTime: 0.05, history: [0.05] }
```

### Synchronous Functions

```typescript
import { trace } from 'func-trace';

const sum = () => {
    return 1 + 2 + 3 + 4 + 5;
};

const tracedSum = trace(sum, { log: true });

tracedSum(); // [func-trace] sum executed in 0.02ms
tracedSum(); // [func-trace] sum executed in 0.01ms
tracedSum(); // [func-trace] sum executed in 0.02ms

console.log(tracedSum.stats);
// {
//   calls: 3,
//   errors: 0,
//   lastTime: 0.02,
//   history: [0.02, 0.01, 0.02]
// }
```

### Asynchronous Functions

```typescript
import { trace } from 'func-trace';

const fetchTodo = trace(
    async (id: number) => {
        const res = await fetch(
            `https://jsonplaceholder.typicode.com/todos/${id}`
        );
        return res.json();
    },
    { log: true }
);

await fetchTodo(1);
// [func-trace] fetchTodo executed in 145.32ms

console.log(fetchTodo.stats);
// {
//   calls: 1,
//   errors: 0,
//   lastTime: 145.32,
//   history: [145.32]
// }
```

### Named Functions

```typescript
import { trace } from 'func-trace';

const multiply = (a: number, b: number) => a * b;
const tracedMultiply = trace(multiply, { log: true });

tracedMultiply(3, 4);
// [func-trace] multiply executed in 0.03ms
```

## API Reference

### `trace<F>(fn: F, options?: TraceOptions): F & { stats: TraceStats }`

Wraps a function with performance tracking and returns the wrapped function with stats.

#### Parameters

- **fn** - The function to trace (sync or async)
- **options** - Configuration object (optional)

#### Options

```typescript
interface TraceOptions {
    log?: boolean;           // Enable console logging (default: false)
    maxHistory?: number;     // Number of execution times to keep (default: 50)
    color?: boolean;         // Enable colored output (default: true)
}
```

#### Return Value

The wrapped function with attached `stats` property:

```typescript
interface TraceStats {
    calls: number;      // Total number of calls
    errors: number;     // Total number of errors
    lastTime: number;   // Last execution time in ms
    history: number[];  // Array of last N execution times
}
```

## Production Examples

### Database Query Monitoring

```typescript
import { trace } from 'func-trace';

const getUserById = trace(
    async (userId: string) => {
        // Your database query
        const user = await db.users.findById(userId);
        return user;
    },
    { log: true, maxHistory: 100 }
);

// Monitor performance over time
async function handleRequest(userId: string) {
    const user = await getUserById(userId);
    
    // Check if query is getting slower
    const avgTime = 
        getUserById.stats.history.reduce((a, b) => a + b, 0) / 
        getUserById.stats.history.length;
    
    if (avgTime > 100) {
        console.warn('Database query is getting slow');
    }
    
    return user;
}
```

### API Endpoint Monitoring

```typescript
import { trace } from 'func-trace';

const apiCall = trace(
    async (url: string) => {
        const response = await fetch(url);
        return response.json();
    },
    { log: true, maxHistory: 200 }
);

// Track API performance
console.log(`Total API calls: ${apiCall.stats.calls}`);
console.log(`Failed calls: ${apiCall.stats.errors}`);
console.log(`Last response time: ${apiCall.stats.lastTime}ms`);
```

### Function Performance Alerts

```typescript
import { trace } from 'func-trace';

const criticalOperation = trace(
    async () => {
        // Some critical operation
    },
    { log: true, maxHistory: 50 }
);

async function executeWithAlert() {
    await criticalOperation();
    
    const avgTime = 
        criticalOperation.stats.history.reduce((a, b) => a + b, 0) / 
        criticalOperation.stats.history.length;
    
    if (avgTime > 1000) {
        // Send alert to monitoring service
        console.error('⚠️ Operation exceeded SLA threshold');
    }
}
```

## Best Practices

1. **Enable logging in development** - Use `log: true` during development for instant feedback
2. **Disable logging in production** - Set `log: false` for performance-critical paths
3. **Adjust history size** - Use `maxHistory` based on your monitoring needs
4. **Track errors** - Use `stats.errors` to identify failing operations
5. **Analyze history** - Review `history` array for performance trends

## Performance Considerations

- Minimal overhead (~0.05ms per call)
- Memory efficient with configurable history size
- No garbage collection pressure with bounded history array
- Suitable for high-frequency function calls

## License

MIT © [Masum Billah](https://masum-billah.vercel.app)

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.
