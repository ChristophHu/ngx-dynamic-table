import { trigger, sequence, animate, transition, style } from '@angular/animations'

export const rowsAnimation = [
    trigger('rowsAnimation', [
        transition('void => *', [
          style({ height: '*', opacity: '0', transform: 'translateY(-100%)', 'box-shadow': 'none' }),
          sequence([
            animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateY(0)', 'box-shadow': 'none'  })),
            animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
    ])
]