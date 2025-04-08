(function() {
/**
 * Configuration
 */
const defaultDuration = 0.6;
const defaultStagger = 0.05; // Faster stagger
const defaultY = 30;
const defaultOpacity = 0;
const defaultEase = 'power2.out';

// Delay increment for sub-elements within each group item
const nestedDelayIncrement = 0.02;

// Classes you want to auto-animate
const customClasses = ['.fade-up-anim', '.another-custom-class'];

// Make sure GSAP is available
if (typeof gsap === 'undefined') {
    console.warn('GSAP not found. Make sure it is loaded on this page.');
    return;
}

// IntersectionObserver to trigger animations
const observer = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
});

// We'll define a selector that captures:
// 1. Headings (h1-h6)
// 2. Our custom classes
// 3. [data-animate]
const headingSelector = 'h1, h2, h3, h4, h5, h6';
const customClassSelector = customClasses.join(',');
const animateSelector = '[data-animate]';

// Combine them into one big comma-separated selector
// e.g. "h1,h2,h3,h4,h5,h6,.fade-up-anim,[data-animate]"
const combinedSelector = [
    headingSelector,
    customClassSelector,
    animateSelector
].join(',');

// 1) Identify group containers
const groupContainers = document.querySelectorAll('[data-animate-group]');

// 2) Identify potential single elements:
//    - everything that matches combinedSelector
//    - but is NOT inside a [data-animate-group]
let allMatches = Array.from(document.querySelectorAll(combinedSelector));
const singleElements = allMatches.filter((el) => {
    return !el.closest('[data-animate-group]');
});

// 3) Identify all animatable elements INSIDE any group container
//    We'll set them offscreen at load (to avoid flicker).
//    Then animate them in the group timeline, including nested headings, etc.
const groupInnerElems = document.querySelectorAll(`
    [data-animate-group] ${combinedSelector}
`);

// 4) Combine singleElements + groupInnerElems to set their initial state
let allPotentialTargets = [...singleElements, ...groupInnerElems];
// Remove duplicates if any
allPotentialTargets = Array.from(new Set(allPotentialTargets));

// Immediately set them off-screen to avoid flicker
gsap.set(allPotentialTargets, { y: defaultY, opacity: defaultOpacity });

// Observe single elements
singleElements.forEach((el) => observer.observe(el));
// Observe group containers
groupContainers.forEach((group) => observer.observe(group));

/**
 * IntersectionObserver callback
 */
function onIntersect(entries) {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        if (entry.target.hasAttribute('data-animate-group')) {
        animateGroup(entry.target);
        } else {
        animateSingle(entry.target);
        }
        observer.unobserve(entry.target);
    }
    });
}

/**
 * Animate a single element
 */
function animateSingle(el) {
    gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: defaultDuration,
    ease: defaultEase
    });
}

/**
 * Animate a group in staggered fashion.
 * Each child with [data-animate] is considered a "group item".
 * Then we also animate headings/custom-class elements inside that item
 * with a small nested delay.
 */
function animateGroup(groupEl) {
    // All direct "items" in the group. In other words, the set of [data-animate].
    // (We only want to stagger [data-animate] items themselves.)
    const groupItems = groupEl.querySelectorAll('[data-animate]');

    // Create a GSAP timeline so we can coordinate stagger + nested offsets
    const tl = gsap.timeline({
    defaults: {
        duration: defaultDuration,
        ease: defaultEase
    }
    });

    // Animate each group item
    groupItems.forEach((item, i) => {
    // 1) The item itself
    tl.to(item, {
        y: 0,
        opacity: 1
    }, i * defaultStagger);

    // 2) Now animate sub-elements within this item
    //    We'll look for headings, custom classes, or data-animate
    //    But skip the item itself if it also matches
    const nestedMatches = item.querySelectorAll(combinedSelector);
    const nestedChildren = Array.from(nestedMatches).filter(n => n !== item);

    nestedChildren.forEach((nChild, j) => {
        tl.to(nChild, {
        y: 0,
        opacity: 1
        }, 
        // Start slightly after the parent item begins animating
        i * defaultStagger + (j + 1) * nestedDelayIncrement
        );
    });
    });
}

})();