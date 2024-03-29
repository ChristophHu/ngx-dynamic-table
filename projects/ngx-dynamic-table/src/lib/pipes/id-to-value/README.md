# ID to Value Pipe

## Use
    
```typescript
import { IdToValuePipe } from 'ngx-dynamic-table'
...
const kat: any[] = [
    { id: '1', bezeichnung: 'Bezeichnung 1' },
    { id: '2', bezeichnung: 'Bezeichnung 2' },
    { id: '3', bezeichnung: 'Bezeichnung 3' },
    { id: '4', bezeichnung: 'Bezeichnung 4' }
]
let id: number = '1'
```

```html
<div>
    {{ id | idToValue: kat }}
</div>
```

Output: `Bezeichnung 1`
