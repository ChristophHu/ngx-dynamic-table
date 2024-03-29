# Truncate/Shorten Pipe

## Use
    
```html
<div>
{{ 'Lorem Ipsum dolor sit amet.' | truncate: 11 }}
</div>
```

Output: `Lorem Ipsum...`
## Alternativen

```html
<div class="text">
    Lorme Ipsum dolor sit amet.
</div>
```

```css
.text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
```