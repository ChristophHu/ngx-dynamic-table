import { animate, state, style, transition, trigger } from "@angular/animations"

/**
 * Hide animation
 * @example
 * <div @hide="true" class="absolute inset-0 bg-black"></div>
 */
const hide = trigger('hide', [
    state('*', style({ opacity  : 1 })),
    state('void', style({opacity  : 0 })),
    transition('* => void', animate('200ms ease-out'))
])

export { hide }