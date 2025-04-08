(function() {
/**
 * Configuration
 */
const defaultDuration = 0.6;
const defaultStagger = 0.05; // faster stagger between group items
const defaultY = 30;
const defaultOpacity = 0;
const defaultEase = 'power2.out';

// Inner delay for sub-elements in each group item
// e.g. headings or other matched elements inside each item
const nestedDelayIncrement = 0.02;

// Classes you want to auto-animate (add or remove here)
const customClasses = ['.fade-up-anim', '.another-custom-class'];

// Ensure GSAP is loaded
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

/**
 * 1) Identify group containers: [data-animate-group]
 * 2) Identify single elements:
 *    - All headings (h1-h6)
 *    - Elements with custom classes
 *    - Elements with [data-animate]
 */
const groupContainers = document.querySelectorAll('[data-animate-group]');

// Build a selector for custom classes: '.fade-up-anim, .another-custom-class'
const customClassSelector = customClasses.join(',');
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
const customClassElems = customClassSelector 
    ? document.querySelectorAll(customClassSelector) 
    : [];
const dataAnimateElems = document.querySelectorAll('[data-animate]');

// Combine them all, then remove duplicates
let potentialSingles = [
    ...headings,
    ...customClassElems,
    ...dataAnimateElems
];
potentialSingles = Array.from(new Set(potentialSingles));

// Exclude those inside a [data-animate-group], which are animated by the group
const singleElements = potentialSingles.filter((el) => {
    return !el.closest('[data-animate-group]');
});

// Also gather [data-animate] inside groups for their initial states
const groupChildren = document.querySelectorAll('[data-animate-group] [data-animate]');

// Merge all items that might animate so we can set their initial offscreen position
let allPotentialTargets = [...singleElements, ...groupChildren];
allPotentialTargets = Array.from(new Set(allPotentialTargets));

// Immediately set them offscreen to avoid flicker
gsap.set(allPotentialTargets, { y: defaultY, opacity: defaultOpacity });

// Observe single elements
singleElements.forEach((el) => observer.observe(el));
// Observe group containers
groupContainers.forEach((group) => observer.observe(group));

/**
 * Intersection Observer callback
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
 * Animate a group of items in staggered fashion,
 * and if an item has further "nested" animatable elements,
 * animate them shortly after their parent.
 */
function animateGroup(groupEl) {
    // All items in this group
    const items = groupEl.querySelectorAll('[data-animate]');
    // If you want the group container to override the default stagger, you could do:
    // let groupStagger = parseFloat(groupEl.getAttribute('data-stagger')) || defaultStagger;
    const groupStagger = defaultStagger;

    // We use a GSAP timeline so we can coordinate stagger + nested offsets
    const tl = gsap.timeline({
    defaults: {
        duration: defaultDuration,
        ease: defaultEase
    }
    });

    // Animate each group item with a main stagger
    items.forEach((item, i) => {
    // Animate the item itself
    tl.to(item, {
        y: 0,
        opacity: 1
    }, i * groupStagger);

    // Animate any "nested" headings / custom-class elements INSIDE this item
    // after a small additional delay
    const nested = item.querySelectorAll(`
        h1, h2, h3, h4, h5, h6,
        ${customClassSelector},
        [data-animate]
    `);
    // We'll skip the item itself to avoid double-animating
    // So let's filter out if "nested" includes 'item'
    const nestedTargets = Array.from(nested).filter(n => n !== item);

    // Animate each nested child slightly after its parent
    nestedTargets.forEach((nChild, j) => {
        tl.to(nChild, {
        y: 0,
        opacity: 1
        }, i * groupStagger + (j + 1) * nestedDelayIncrement);
    });
    });
}

})();