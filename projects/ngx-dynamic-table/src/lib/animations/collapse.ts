import { trigger, state, style, transition, animate } from "@angular/animations"

const collapse = [
    trigger('collapse', [
        state('true', style({ height: '*' })),
        state('false', style({ height: '0', visibility: 'hidden' })),
        transition('false => true', animate('300ms ease')),
        transition('true => false', animate('300ms ease'))
    ])
]

export { collapse }