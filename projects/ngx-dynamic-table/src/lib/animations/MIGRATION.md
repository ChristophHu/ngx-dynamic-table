# Animation Migration: Angular to CSS

## Hide Animation Conversion

The `hide` animation has been converted from Angular Animations to native CSS for better performance and reduced bundle size.

### Before (Angular Animation)
```typescript
// Component
import { hide } from './animations/hide'

@Component({
  animations: [hide]
})

// Template
<div [@hide]="true">Content</div>
```

### After (CSS Animation)
```typescript
// Component - no animation imports needed

// Template - two approaches available:

// 1. Transition-based (recommended)
<div class="hide-animation" [class.hidden]="shouldHide">Content</div>

// 2. Keyframe-based
<div [class.hide-fade-out]="shouldHide">Content</div>
```

### CSS Classes Available

- `hide-animation`: Base class with transition setup
- `hidden`: Add this class to trigger the fade-out transition
- `hide-fade-out`: Alternative keyframe-based animation

### Benefits

1. **Better Performance**: No JavaScript animation overhead
2. **Smaller Bundle**: Removed dependency on Angular Animations
3. **Native Browser Optimization**: Browsers can optimize CSS animations better
4. **Easier Customization**: Modify CSS directly without touching TypeScript

### Migration Steps

1. ✅ Remove Angular animation imports
2. ✅ Update component animations array  
3. ✅ Replace `[@hide]` with CSS classes in templates
4. ✅ Import CSS file in component styles
5. ✅ Update component logic to toggle CSS classes instead of animation states

### Backward Compatibility

The old `hide` export is still available but deprecated. It now exports the same object as `hideAnimationClasses` for transition compatibility.