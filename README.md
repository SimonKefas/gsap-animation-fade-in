# Fade-Up Animation Solution (Using GSAP + Intersection Observer)

This JavaScript snippet automatically animates elements from below (with lowered opacity) to their final position on scroll into view. It supports:

- **All Headings** (h1–h6)  
- **Custom Classes** (e.g. `.fade-up-anim`, `.another-custom-class`)  
- **Individual Elements** with `[data-animate]`  
- **Group Animations** with `[data-animate-group]`

## Table of Contents

1. [Overview](#overview)  
2. [Setup](#setup)  
3. [Basic Usage](#basic-usage)  
4. [Grouped / Staggered Animations](#grouped--staggered-animations)  
5. [Custom Classes](#custom-classes)  
6. [Configuration](#configuration)  
7. [Tips to Avoid Flicker](#tips-to-avoid-flicker)

---

## Overview

- **Purpose**: Subtle fade-up animation for headings, custom-class elements, and data-attribute‑marked elements.  
- **Animation**: By default, elements move from `y = 30px` to `y = 0` and `opacity = 0` to `opacity = 1`.  
- **Trigger**: Uses `IntersectionObserver` to animate elements only when they appear in the viewport.  
- **Stagger**: Group containers can animate child elements in a sequence (e.g. a list).  

## Setup

1. **Load GSAP**  
   Make sure GSAP is loaded. If your site doesn’t have it, include:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
   ```
2. **Paste the Script**  
   Place the JavaScript snippet in either:
   - The `<head>` of your page, or
   - Early in the `<body>` (above the main content)

   If placed at the very bottom of `<body>`, the animations may flicker momentarily on slow connections.

3. **Ensure Elements Exist**  
   The script looks for:
   - All headings: `h1, h2, h3, h4, h5, h6`
   - Custom classes: `.fade-up-anim`, `.another-custom-class` (you can modify this list)
   - `[data-animate]`
   - Group containers: `[data-animate-group]`

## Basic Usage

### 1. Automatic Heading Animation

All headings (`<h1>` to `<h6>`) are automatically animated. Nothing else is required.

### 2. Animate Custom Classes

By default, the script includes two custom classes in its `customClasses` array:
- `.fade-up-anim`
- `.another-custom-class`

Any element with one of these classes will fade-up automatically when it enters the viewport.

Feel free to add or remove classes to the array:

```js
// Example from the code
const customClasses = ['.fade-up-anim', '.another-custom-class'];
```

### 3. Animate Elements With `[data-animate]`

If you prefer to manually mark elements to animate, simply add the attribute:

```html
<div data-animate>Fade up on scroll</div>
```

## Grouped / Staggered Animations

If you have a set of elements you want to animate in a sequential stagger (one after the other), you can group them:

```html
<div data-animate-group>
  <p data-animate>Item A</p>
  <p data-animate>Item B</p>
  <p data-animate>Item C</p>
</div>
```

- The script will **only** stagger items marked with `[data-animate]` inside a container marked `[data-animate-group]`.
- **Stagger Interval**: Controlled by `defaultStagger` (e.g. `0.1` seconds between each item).

## Custom Classes

You can define or remove your own classes in the `customClasses` array. For example, if you only want `.fade-up-anim`:

```js
const customClasses = ['.fade-up-anim'];
```

Any element with `.fade-up-anim` will get the same fade-up animation as headings or `[data-animate]`.

## Configuration

Inside the script, you’ll find the following default values:

```js
const defaultDuration = 0.6;      // How long each animation takes
const defaultStagger = 0.1;      // Delay between group items
const defaultY = 30;             // Initial offset in pixels
const defaultOpacity = 0;        // Start at 0 = fully transparent
const defaultEase = 'power2.out'; // GSAP easing
```

You can edit these to your preference:

- **`defaultDuration`**: Increase if you want a slower fade.  
- **`defaultStagger`**: Increase for more time between items in groups.  
- **`defaultY`**: Increase if you want the element to start lower.  
- **`defaultEase`**: Change to another GSAP ease (e.g. `"power1.inOut"`, `"expo.out"`, etc.).

## Tips to Avoid Flicker

1. **Load Script Early**  
   Insert the script in the `<head>` or near the top of `<body>` so the elements are set to `opacity: 0` and `translateY(30px)` before the user can see them.

2. **Inline CSS (Optional)**  
   You can add a small CSS snippet (e.g., `body [data-animate], body h1, body .fade-up-anim { opacity:0; transform: translateY(30px); }`) to keep them hidden if JS is slow to load. GSAP will overwrite these values when animating them in.

3. **Avoid Overlapping Animations**  
   If the same element matches multiple conditions (e.g., both `[data-animate]` and a custom class), that’s okay—the script deduplicates them. For group containers, make sure only child elements inside `[data-animate-group]` have `[data-animate]`.

---

### Example Markup

```html
<!-- Single Element Animations -->
<h1>This heading will fade up automatically.</h1>
<h2>Another heading, also automatically animated.</h2>

<div class="fade-up-anim">
  I have a custom class and will fade up.
</div>

<div data-animate>
  I am specifically tagged with [data-animate].
</div>

<!-- Grouped, Staggered Animation -->
<div data-animate-group>
  <p data-animate>List item one</p>
  <p data-animate>List item two</p>
  <p data-animate>List item three</p>
</div>
```

### Putting It All Together

With these steps, you’ll have a smooth fade-up effect for headings, custom classes, individually tagged elements, and optional grouped/staggered lists—providing a consistent, maintainable, attribute-based approach to animating your content.