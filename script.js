(function() {
/**
 * Configuration
 */
const defaultDuration = 0.6;
const defaultStagger = 0.1;
const defaultY = 30;
const defaultOpacity = 0;
const defaultEase = 'power2.out';

// You can define multiple custom classes to automatically animate here.
const customClasses = ['.fade-up-anim', '.another-custom-class'];

// Make sure GSAP is available
if (typeof gsap === 'undefined') {
    console.warn('GSAP not found. Make sure it is loaded on this page.');
    return;
}

// Build our IntersectionObserver
const observer = new IntersectionObserver(onIntersect, {
    root: null,
    // Trigger a little early so the element is moved into final position
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
});

/**
 * 1) Identify all group containers: [data-animate-group]
 * 2) Identify single elements:
 *    - All headings (h1-h6)
 *    - All elements with custom classes
 *    - All elements with [data-animate]
 */
const groupContainers = document.querySelectorAll('[data-animate-group]');

const customClassSelector = customClasses.join(',');
const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
const customClassElems = customClassSelector 
    ? document.querySelectorAll(customClassSelector) 
    : [];
const dataAnimateElems = document.querySelectorAll('[data-animate]');

// Combine them into one array, then filter duplicates
let potentialSingles = [
    ...headings,
    ...customClassElems,
    ...dataAnimateElems
];
potentialSingles = Array.from(new Set(potentialSingles));

// Exclude those that are inside a group container, since they'll be animated as a group
const singleElements = potentialSingles.filter((el) => {
    return !el.closest('[data-animate-group]');
});

/**
 * IMPORTANT: Immediately set all potential targets to hidden/offscreen
 * to avoid flicker when the script loads.
 *
 * We also include group children in this array
 * so everything we plan to animate is set to an initial state.
 */
// Gather all [data-animate] inside [data-animate-group] for group children
const groupChildren = Array.from(
    document.querySelectorAll('[data-animate-group] [data-animate]')
);

// Combine all single elements + group children into one array
let allPotentialTargets = [...singleElements, ...groupChildren];
allPotentialTargets = Array.from(new Set(allPotentialTargets));

// Immediately set them to y=30, opacity=0 (or your chosen initial state)
gsap.set(allPotentialTargets, { y: defaultY, opacity: defaultOpacity });

// Observe single elements
singleElements.forEach((el) => {
    observer.observe(el);
});

// Observe group containers
groupContainers.forEach((group) => {
    observer.observe(group);
});

/**
 * Intersection Observer callback
 */
function onIntersect(entries) {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        // If it's a group container, animate children with stagger
        if (entry.target.hasAttribute('data-animate-group')) {
        animateGroup(entry.target);
        } else {
        // Single element
        animateElement(entry.target);
        }
        // Stop observing once triggered
        observer.unobserve(entry.target);
    }
    });
}

/**
 * Animate a single element
 */
function animateElement(el) {
    gsap.to(el, {
    y: 0,
    opacity: 1,
    duration: defaultDuration,
    ease: defaultEase
    });
}

/**
 * Animate a group of elements in a staggered fashion
 */
function animateGroup(groupEl) {
    // All children with [data-animate]
    const items = groupEl.querySelectorAll('[data-animate]');
    // Optionally let the container override the default stagger
    // const groupStagger = parseFloat(groupEl.getAttribute('data-stagger')) || defaultStagger;
    const groupStagger = defaultStagger;

    gsap.to(items, {
    y: 0,
    opacity: 1,
    duration: defaultDuration,
    ease: defaultEase,
    stagger: groupStagger
    });
}
})();