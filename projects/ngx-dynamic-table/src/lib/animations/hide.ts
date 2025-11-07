/**
 * Hide animation - CSS classes
 * 
 * Usage examples:
 * 
 * 1. Transition-based approach:
 * <div class="hide-animation" [class.hidden]="isHidden">Content</div>
 * 
 * 2. Keyframe-based approach:
 * <div [class.hide-fade-out]="shouldHide">Content</div>
 */

export const hideAnimationClasses = {
  /** Base class for transition-based hide animation */
  base: 'hide-animation',
  /** Class to add when element should be hidden (triggers opacity transition) */
  hidden: 'hidden',
  /** Class for keyframe-based fade out animation */
  fadeOut: 'hide-fade-out'
} as const

/**
 * @deprecated Use hideAnimationClasses instead. This will be removed in a future version.
 * Legacy export for backward compatibility
 */
export const hide = hideAnimationClasses